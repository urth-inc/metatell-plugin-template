#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { deflateRawSync } from "node:zlib";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const validator = path.join(scriptDirectory, "validate-plugin-package.mjs");
const versionId = "app_0123456789abcdef0123456789abcdef";

function validFiles() {
  return {
    "remoteEntry.js": "globalThis.__remote_loaded__ = true;\n",
    "metadata.json": JSON.stringify({
      name: "smoke-plugin",
      type: "CustomOverlay",
      description: "Smoke-test fixture",
      version: "1.0.0",
      versionId,
    }),
    "mf-manifest.json": JSON.stringify({
      id: versionId,
      name: versionId,
      metaData: { name: versionId, globalName: versionId },
      exposes: [{ id: `${versionId}:CustomOverlay`, name: "CustomOverlay", path: "./CustomOverlay" }],
      shared: [
        { name: "react", singleton: true, requiredVersion: "^18.3.1" },
        { name: "react-dom", singleton: true, requiredVersion: "^18.3.1" },
      ],
    }),
  };
}

function writeDirectory(root, files) {
  fs.mkdirSync(root, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    const target = path.join(root, ...name.split("/"));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

const crcTable = Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = (crc & 1) !== 0 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return crc >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function createDeflatedZip(zipPath, files) {
  const localRecords = [];
  const centralRecords = [];
  let localOffset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBuffer = Buffer.from(name.replaceAll("\\", "/"), "utf8");
    const data = Buffer.from(content);
    const compressed = deflateRawSync(data);
    const checksum = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuffer.length, 26);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuffer.length, 28);
    central.writeUInt32LE(localOffset, 42);

    const localRecord = Buffer.concat([local, nameBuffer, compressed]);
    localRecords.push(localRecord);
    centralRecords.push(Buffer.concat([central, nameBuffer]));
    localOffset += localRecord.length;
  }

  const centralDirectory = Buffer.concat(centralRecords);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(centralRecords.length, 8);
  eocd.writeUInt16LE(centralRecords.length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(localOffset, 16);
  fs.writeFileSync(zipPath, Buffer.concat([...localRecords, centralDirectory, eocd]));
}

function run(input, json = true) {
  const args = [validator];
  if (json) args.push("--json");
  args.push(input);
  return spawnSync(process.execPath, args, { encoding: "utf8" });
}

function parseResult(runResult) {
  assert.equal(runResult.signal, null, runResult.stderr);
  return JSON.parse(runResult.stdout);
}

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "metatell-plugin-smoke-"));
try {
  const validDirectory = path.join(temporaryRoot, "valid-dist");
  writeDirectory(validDirectory, validFiles());
  const validDirectoryRun = run(validDirectory);
  assert.equal(validDirectoryRun.status, 0, validDirectoryRun.stdout || validDirectoryRun.stderr);
  assert.equal(parseResult(validDirectoryRun).ok, true);

  const validZip = path.join(temporaryRoot, "valid-plugin.zip");
  createDeflatedZip(validZip, validFiles());
  const validZipRun = run(validZip);
  assert.equal(validZipRun.status, 0, validZipRun.stdout || validZipRun.stderr);
  assert.equal(parseResult(validZipRun).kind, "zip");

  const invalidDirectory = path.join(temporaryRoot, "invalid-version-id");
  const invalidFiles = validFiles();
  invalidFiles["metadata.json"] = JSON.stringify({
    ...JSON.parse(invalidFiles["metadata.json"]),
    versionId: "app_reused-or-hand-edited",
  });
  writeDirectory(invalidDirectory, invalidFiles);
  const invalidRun = run(invalidDirectory);
  assert.equal(invalidRun.status, 1);
  assert.match(parseResult(invalidRun).errors.join("\n"), /versionId must match/);

  const wrappedZip = path.join(temporaryRoot, "wrapped-plugin.zip");
  createDeflatedZip(
    wrappedZip,
    Object.fromEntries(Object.entries(validFiles()).map(([name, value]) => [`dist/${name}`, value])),
  );
  const wrappedRun = run(wrappedZip);
  assert.equal(wrappedRun.status, 1);
  assert.match(parseResult(wrappedRun).errors.join("\n"), /extra top-level directory/);

  const warningDirectory = path.join(temporaryRoot, "warning-dist");
  writeDirectory(warningDirectory, { ...validFiles(), "assets/plugin.js.map": "{}" });
  const warningRun = run(warningDirectory);
  assert.equal(warningRun.status, 0);
  assert.match(parseResult(warningRun).warnings.join("\n"), /source map/);

  console.log("PASS: validate-plugin-package smoke tests (directory, deflated ZIP, failures, warnings)");
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
