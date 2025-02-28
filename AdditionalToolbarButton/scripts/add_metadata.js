const path = require("path");
const fs = require("fs");
const { name, version, description } = require("../package.json");
const process = require("process");

const versionId = process.env.VERSION_ID;

const metadata = {
  name,
  version,
  description,
  type: "AdditionalToolbarButton",
  versionId,
};
const jsonData = JSON.stringify(metadata, null, 2);

const directoryPath = path.resolve(__dirname, "../", "dist");
const filePath = path.join(directoryPath, "metadata.json");

fs.writeFile(filePath, jsonData, "utf8", (err) => {
  if (err) {
    console.error(`Error writing file: ${err}`);
  } else {
    console.log("JSON data has been written to the file successfully.");
  }
});
