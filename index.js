const fs = require("fs");
const path = require("path");

function getFolderCapacity(dir) {
  if (!dir)
    return {
      error: "Directory is required",
    };

  if (!fs.existsSync(dir)) {
    return {
      error: "Directory does not exist",
    };
  }
  let total = 0;
  const files = fs.readdirSync(dir);

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

function bytesToGB(bytes) {
  return bytes / 1024 ** 3;
}

function formatSizeInGB(bytes) {
  return bytesToGB(bytes).toFixed(2) + "GB";
}

function getFolderCapacityInfo(dir) {
  const output = getFolderCapacity(dir);
  if (output.error) {
    return {
      error: output.error,
    };
  }

  return {
    totalBytes: output,
    totalGB: parseFloat(formatSizeInGB(output)),
  };
}

const directoryInfo = getFolderCapacityInfo("");

if (directoryInfo.error) {
  console.error(directoryInfo.error);
} else {
  console.log(`directory info is ${JSON.stringify(directoryInfo)}`);
}
