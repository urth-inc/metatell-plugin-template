#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { inflateRawSync } from "node:zlib";

const REQUIRED_ROOT_FILES = [
  "remoteEntry.js",
  "mf-manifest.json",
  "metadata.json",
];
const PLUGIN_TYPES = new Set([
  "CustomChatButton",
  "CustomMegaphoneButton",
  "CustomEntryPanel",
  "CustomLeaveButton",
  "CustomOverlay",
  "CustomProfileModal",
  "AdditionalToolbarButton",
  "CustomWebCameraButton",
  "CustomNearestUserProfile",
  "CustomTutorial",
  "CustomExitScreen",
]);

function usage() {
  return "Usage: validate-plugin-package.mjs [--json] <path-to-dist-dir-or-plugin.zip>";
}

function normalizeEntryName(value) {
  let name = value.replaceAll("\\", "/");
  while (name.startsWith("./")) name = name.slice(2);
  return name;
}

function assertSafeEntryName(name) {
  if (
    !name ||
    name.includes("\0") ||
    name.startsWith("/") ||
    /^[A-Za-z]:\//.test(name) ||
    name.split("/").includes("..")
  ) {
    throw new Error(`Unsafe zip entry path: ${JSON.stringify(name)}`);
  }
}

function findEndOfCentralDirectory(buffer) {
  const minimum = Math.max(0, buffer.length - 22 - 0xffff);
  for (let offset = buffer.length - 22; offset >= minimum; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) return offset;
  }
  throw new Error("ZIP end-of-central-directory record was not found");
}

function readZipEntries(zipPath) {
  const archive = fs.readFileSync(zipPath);
  const eocd = findEndOfCentralDirectory(archive);
  const diskNumber = archive.readUInt16LE(eocd + 4);
  const centralDisk = archive.readUInt16LE(eocd + 6);
  const entriesOnDisk = archive.readUInt16LE(eocd + 8);
  const totalEntries = archive.readUInt16LE(eocd + 10);
  const centralSize = archive.readUInt32LE(eocd + 12);
  const centralOffset = archive.readUInt32LE(eocd + 16);

  if (diskNumber !== 0 || centralDisk !== 0 || entriesOnDisk !== totalEntries) {
    throw new Error("Multi-disk ZIP archives are not supported");
  }
  if (
    totalEntries === 0xffff ||
    centralSize === 0xffffffff ||
    centralOffset === 0xffffffff
  ) {
    throw new Error("ZIP64 archives are not supported");
  }
  if (centralOffset + centralSize > eocd || centralOffset > archive.length) {
    throw new Error("ZIP central directory is outside the archive bounds");
  }

  const entries = new Map();
  let cursor = centralOffset;
  for (let index = 0; index < totalEntries; index += 1) {
    if (cursor + 46 > archive.length || archive.readUInt32LE(cursor) !== 0x02014b50) {
      throw new Error(`Invalid ZIP central-directory entry at index ${index}`);
    }

    const flags = archive.readUInt16LE(cursor + 8);
    const method = archive.readUInt16LE(cursor + 10);
    const compressedSize = archive.readUInt32LE(cursor + 20);
    const uncompressedSize = archive.readUInt32LE(cursor + 24);
    const fileNameLength = archive.readUInt16LE(cursor + 28);
    const extraLength = archive.readUInt16LE(cursor + 30);
    const commentLength = archive.readUInt16LE(cursor + 32);
    const localOffset = archive.readUInt32LE(cursor + 42);
    const recordLength = 46 + fileNameLength + extraLength + commentLength;

    if (cursor + recordLength > archive.length) {
      throw new Error(`Truncated ZIP central-directory entry at index ${index}`);
    }
    if (
      compressedSize === 0xffffffff ||
      uncompressedSize === 0xffffffff ||
      localOffset === 0xffffffff
    ) {
      throw new Error("ZIP64 entries are not supported");
    }
    if ((flags & 0x1) !== 0) throw new Error("Encrypted ZIP entries are not supported");

    const rawName = archive.subarray(cursor + 46, cursor + 46 + fileNameLength);
    const name = normalizeEntryName(rawName.toString("utf8"));
    assertSafeEntryName(name);
    cursor += recordLength;

    if (name.endsWith("/")) continue;
    if (entries.has(name)) throw new Error(`Duplicate ZIP entry: ${name}`);
    if (method !== 0 && method !== 8) {
      throw new Error(`Unsupported ZIP compression method ${method} for ${name}`);
    }
    if (localOffset + 30 > archive.length || archive.readUInt32LE(localOffset) !== 0x04034b50) {
      throw new Error(`Invalid local ZIP header for ${name}`);
    }

    const localNameLength = archive.readUInt16LE(localOffset + 26);
    const localExtraLength = archive.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const dataEnd = dataStart + compressedSize;
    if (dataEnd > archive.length) throw new Error(`Truncated ZIP data for ${name}`);

    entries.set(name, {
      size: uncompressedSize,
      read() {
        const compressed = archive.subarray(dataStart, dataEnd);
        const data = method === 0 ? Buffer.from(compressed) : inflateRawSync(compressed);
        if (data.length !== uncompressedSize) {
          throw new Error(`Uncompressed size mismatch for ${name}`);
        }
        return data;
      },
    });
  }

  return { entries, sizeBytes: archive.length, kind: "zip" };
}

function readDirectoryEntries(rootPath) {
  const entries = new Map();
  let sizeBytes = 0;

  function walk(directory, prefix = "") {
    const children = fs.readdirSync(directory, { withFileTypes: true });
    for (const child of children) {
      const absolute = path.join(directory, child.name);
      const relative = prefix ? `${prefix}/${child.name}` : child.name;
      if (child.isSymbolicLink()) {
        throw new Error(`Symbolic links are not supported in a package directory: ${relative}`);
      }
      if (child.isDirectory()) {
        walk(absolute, relative);
      } else if (child.isFile()) {
        const size = fs.statSync(absolute).size;
        sizeBytes += size;
        entries.set(relative, { size, read: () => fs.readFileSync(absolute) });
      }
    }
  }

  walk(rootPath);
  return { entries, sizeBytes, kind: "directory" };
}

function readPackage(inputPath) {
  const stat = fs.statSync(inputPath);
  if (stat.isDirectory()) return readDirectoryEntries(inputPath);
  if (stat.isFile()) return readZipEntries(inputPath);
  throw new Error("Input must be a directory or ZIP file");
}

function parseJsonEntry(entries, name, errors) {
  const entry = entries.get(name);
  if (!entry) return undefined;
  try {
    return JSON.parse(entry.read().toString("utf8"));
  } catch (error) {
    errors.push(`${name} is not valid JSON: ${error.message}`);
    return undefined;
  }
}

function validateString(object, field, errors, allowEmpty = true) {
  const value = object?.[field];
  if (typeof value !== "string") {
    errors.push(`metadata.json ${field} must be a string`);
    return;
  }
  if (!allowEmpty && value.length === 0) {
    errors.push(`metadata.json ${field} must not be empty`);
  }
}

function collectExposeNames(exposes) {
  const values = new Set();
  const add = (value) => {
    if (typeof value !== "string") return;
    values.add(value);
    values.add(value.replace(/^\.\//, ""));
    const tail = value.split(/[:/]/).at(-1);
    if (tail) values.add(tail);
  };

  if (Array.isArray(exposes)) {
    for (const expose of exposes) {
      if (typeof expose === "string") add(expose);
      else if (expose && typeof expose === "object") {
        add(expose.id);
        add(expose.name);
        add(expose.path);
        add(expose.key);
      }
    }
  } else if (exposes && typeof exposes === "object") {
    for (const [key, expose] of Object.entries(exposes)) {
      add(key);
      if (typeof expose === "string") add(expose);
      else if (expose && typeof expose === "object") {
        add(expose.id);
        add(expose.name);
        add(expose.path);
      }
    }
  }
  return values;
}

function findShared(shared, packageName) {
  if (Array.isArray(shared)) {
    return shared.find((item) => item?.name === packageName);
  }
  if (shared && typeof shared === "object") return shared[packageName];
  return undefined;
}

function validatePackage(inputPath) {
  const errors = [];
  const warnings = [];
  const loaded = readPackage(inputPath);
  const { entries, sizeBytes, kind } = loaded;

  const missing = REQUIRED_ROOT_FILES.filter((name) => !entries.has(name));
  if (missing.length > 0) {
    const fileNames = [...entries.keys()];
    const firstSegments = new Set(
      fileNames.filter((name) => name.includes("/")).map((name) => name.split("/", 1)[0]),
    );
    if (firstSegments.size === 1) {
      const wrapper = [...firstSegments][0];
      if (REQUIRED_ROOT_FILES.every((name) => entries.has(`${wrapper}/${name}`))) {
        errors.push(`Package has an extra top-level directory '${wrapper}/'; archive its contents at ZIP root`);
      }
    }
    for (const name of missing) errors.push(`Missing required root file: ${name}`);
  }

  const metadata = parseJsonEntry(entries, "metadata.json", errors);
  const manifest = parseJsonEntry(entries, "mf-manifest.json", errors);

  if (metadata) {
    validateString(metadata, "name", errors, false);
    validateString(metadata, "description", errors);
    validateString(metadata, "version", errors, false);

    if (typeof metadata.type !== "string") {
      errors.push("metadata.json type must be a string");
    } else if (!PLUGIN_TYPES.has(metadata.type)) {
      errors.push(`metadata.json type does not match a public template type: ${metadata.type}`);
    }

    if (typeof metadata.versionId !== "string") {
      errors.push("metadata.json versionId must be a string");
    } else if (!/^app_[0-9a-f]{32}$/.test(metadata.versionId)) {
      errors.push("metadata.json versionId must match ^app_[0-9a-f]{32}$");
    }
  }

  if (manifest) {
    if (metadata?.versionId) {
      for (const field of ["id", "name"]) {
        if (manifest[field] !== metadata.versionId) {
          errors.push(`mf-manifest.json ${field} must equal metadata.json versionId`);
        }
      }
      for (const field of ["name", "globalName"]) {
        if (manifest.metaData?.[field] !== undefined && manifest.metaData[field] !== metadata.versionId) {
          errors.push(`mf-manifest.json metaData.${field} must equal metadata.json versionId`);
        }
      }
    }

    if (typeof metadata.type === "string") {
      const exposeNames = collectExposeNames(manifest.exposes);
      if (!exposeNames.has(metadata.type)) {
        errors.push(`mf-manifest.json exposes must include ${metadata.type}`);
      }
    }

    for (const packageName of ["react", "react-dom"]) {
      const shared = findShared(manifest.shared, packageName);
      if (!shared) {
        warnings.push(`mf-manifest.json does not show ${packageName} as a shared dependency`);
      } else {
        if (shared.singleton !== true) {
          warnings.push(`${packageName} shared dependency is not marked singleton: true`);
        }
        if (typeof shared.requiredVersion !== "string" || shared.requiredVersion.length === 0) {
          warnings.push(`${packageName} shared dependency has no requiredVersion`);
        }
      }
    }
  }

  const sourceMaps = [...entries.keys()].filter((name) => name.toLowerCase().endsWith(".map"));
  if (sourceMaps.length > 0) {
    warnings.push(`Package includes ${sourceMaps.length} source map file(s), which may increase upload size`);
  }

  return {
    ok: errors.length === 0,
    path: path.resolve(inputPath),
    kind,
    sizeBytes,
    errors,
    warnings,
    metadata: metadata
      ? {
          name: metadata.name,
          type: metadata.type,
          version: metadata.version,
          versionId: metadata.versionId,
        }
      : undefined,
  };
}

function printHuman(result) {
  console.log(`${result.ok ? "PASS" : "FAIL"}: ${result.path}`);
  console.log(`Package: ${result.kind}, ${result.sizeBytes} bytes`);
  for (const error of result.errors) console.log(`ERROR: ${error}`);
  for (const warning of result.warnings) console.log(`WARNING: ${warning}`);
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const positional = args.filter((arg) => arg !== "--json");
  if (positional.length !== 1 || args.some((arg) => arg.startsWith("--") && arg !== "--json")) {
    console.error(usage());
    process.exitCode = 2;
    return;
  }

  let result;
  try {
    result = validatePackage(positional[0]);
  } catch (error) {
    result = {
      ok: false,
      path: path.resolve(positional[0]),
      kind: "unknown",
      sizeBytes: 0,
      errors: [error instanceof Error ? error.message : String(error)],
      warnings: [],
    };
  }

  if (json) console.log(JSON.stringify(result, null, 2));
  else printHuman(result);
  if (!result.ok) process.exitCode = 1;
}

main();
