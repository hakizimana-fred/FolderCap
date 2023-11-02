const fs = require("fs");
const path = require("path");

function getFolderCapacity(dir) {
  if (!dir)
    return {
      error: "Directory is required",
    };
  let total = 0;
  const files = fs.readdirSync(dir);
  const folderSizes = {};

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      total += getFolderCapacity(filePath);
    } else {
      total += stats.size;
    }
  }
  return total;
}
const output = getFolderCapacity("");
console.log(output);
