const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");

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

function listTopFolders(dir) {
  const folderCapacities = [];

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const folderPath = path.join(dir, file);

    if (fs.statSync(folderPath).isDirectory()) {
      const capacity = getFolderCapacity(folderPath);
      folderCapacities.push({ name: file, capacity });
    }
  }

  folderCapacities.sort((a, b) => b.capacity - a.capacity);

  return folderCapacities.slice(0, 10);
}

const directoryInfo = getFolderCapacityInfo(
  "/home/ngeni_fred/Development/Reactjs"
);

if (directoryInfo.error) {
  console.error(directoryInfo.error);
} else {
  console.log(`directory info is ${JSON.stringify(directoryInfo)}`);
}

function folders() {
  const foldersDir = listTopFolders("/home/ngeni_fred/Development/Reactjs");
  let formatedFolders = [];
  for (const top of foldersDir) {
    const folderInfo = {};
    folderInfo.size = formatSize(top.capacity);
    folderInfo.name = top.name;
    formatedFolders.push(folderInfo);
  }
  return formatedFolders;
}

function formatSize(sizeInBytes) {
  if (sizeInBytes >= 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(2) + " MB";
  } else if (sizeInBytes >= 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(2) + " KB";
  } else {
    return sizeInBytes + " bytes";
  }
}

const formattedData = folders();

function writeToCSV() {
  const csvWriter = createObjectCsvWriter({
    path: "folder_sizes.csv", // The path to the CSV file
    header: [
      { id: "name", title: "Name" },
      { id: "size", title: "Size" },
    ],
  });

  csvWriter
    .writeRecords(formattedData)
    .then(() => {
      console.log("CSV file has been written.");
    })
    .catch((err) => {
      console.error("Error writing the CSV file:", err);
    });
}

writeToCSV();
