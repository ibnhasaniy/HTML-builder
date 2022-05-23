const fs = require('fs');
const path = require('path');

const FOLDER = path.join(__dirname, '/secret-folder');

fs.readdir(FOLDER, { withFileTypes: true }, (err, folderItems) => {
  if (err) throw err;
  
});
