const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const directoryPath = path.resolve(__dirname, "../", "dist");
const zip = new AdmZip();

const excludeFiles = ["plugin.zip"];

function addFolderToZip(folderPath, zipFolderPath = "") {
  const items = fs.readdirSync(folderPath);
  items.forEach(item => {
    const fullPath = path.join(folderPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addFolderToZip(fullPath, path.join(zipFolderPath, item) + "/");
    } else {
      if (!excludeFiles.includes(item)) {
        const fileData = fs.readFileSync(fullPath);
        zip.addFile(path.join(zipFolderPath, item), fileData);
      }
    }
  });
}

addFolderToZip(directoryPath);

const filePath = path.join(directoryPath, "plugin.zip");
zip.writeZip(filePath);
