const fs = require('fs/promises');
const path = require('path');

const SRC_PATH = path.join(__dirname, '/files');
const DEST_PATH = path.join(__dirname, '/files-copy');

copyDir();

async function copyDir() {
  fs.mkdir(DEST_PATH, { recursive: true });
  let files = await fs.readdir(SRC_PATH, { withFileTypes: true });

  for (let i = 0; i < files.length; i++) {
    if (files[i].isFile) {
      let srcFile = path.join(SRC_PATH, files[i].name);
      let destFile = path.join(DEST_PATH, files[i].name);
      fs.copyFile(srcFile, destFile);
    }
  }
}
