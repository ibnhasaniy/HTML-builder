const fs = require('fs');
const path = require('path');

fileBundler();

async function fileBundler() {
  const DEST_FILE = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css')
  );
  const SRC_FILE = path.join(__dirname, 'styles');

  fs.readdir(SRC_FILE, { withFileTypes: true }, (err, items) => {
    if (err) throw err;

    for (let i = 0; i < items.length; i++) {
      if (items[i].name.split('.')[1] === 'css') {
        let readFilesFrom = fs.createReadStream(
          path.join(__dirname, 'styles', items[i].name),
          'utf-8'
        );
        readFilesFrom.pipe(DEST_FILE);
      }
    }
  });
}
