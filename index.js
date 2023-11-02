const fs = require("fs");
const path = require("path");

function getFolderCapacity(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    console.log(stats, "just stats");
  }
}

getFolderCapacity("/home/ngeni_fred/Development/nodejs");
