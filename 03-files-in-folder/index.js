const fs = require('fs');
const path = require('path');
// FOLDER is our target folder
const FOLDER = path.join(__dirname, '/secret-folder');

fs.readdir(FOLDER, { withFileTypes: true }, (err, items) => {
  if (err) throw err;

  for(let i=0;i<items.length;i++){
    //   get all item names inside for loop
    let itemName=path.join(FOLDER,items[i].name);
    fs.stat(itemName,(err,stats)=>{
      if(err)throw err;
      if(stats.isFile()){
        //   parsedData returns object
        let parsedData= path.parse(items[i].name);
        let fileName = parsedData.name;
        // split by dot and take second  index which is extension of file
        let fileExtension = parsedData.ext.split('.')[1];
        // stats.size will return bytes. Convert to KB and fixed it with .toFixed() method
        let sizeOfFile = (stats.size / 1024).toFixed(1);

        console.log(`${fileName} - ${fileExtension} - ${sizeOfFile}KB`);
      }
    });
  }
});
