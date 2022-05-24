const fs = require('fs');
const fsP = require('fs/promises');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'project-dist');
const SRC_ASSETS = path.join(__dirname, 'assets');
const DEST_ASSETS = path.join(OUTPUT_DIR, 'assets');
const COMPONENTS_DIR = path.join(__dirname, 'components');
const DEST_HTML = path.join(OUTPUT_DIR, 'index.html');
const SRC_HTML = path.join(__dirname, 'template.html');
const STYLES_DIR = path.join(__dirname, 'styles');

async function copyAssets(assetsFrom, assetsTo) {
  await fsP.mkdir(assetsTo, { recursive: true });
  let items = await fsP.readdir(assetsFrom, { withFileTypes: true }, (err) => {
    if (err) throw err;
  });
  for (let i = 0; i < items.length; i++) {
    let from = path.join(assetsFrom, items[i].name);
    let to = path.join(assetsTo, items[i].name);
    if (items[i].isDirectory()) {
      copyAssets(from, to);
    } else {
      fsP.copyFile(from, to);
    }
  }
}

copyAssets(SRC_ASSETS, DEST_ASSETS);

async function cssBundler(DEST) {
  await fsP.mkdir(DEST, { recursive: true });
  const cssTo = fs.createWriteStream(path.join(OUTPUT_DIR, 'style.css'));

  fs.readdir(STYLES_DIR, { withFileTypes: true }, (err, items) => {
    if (err) throw err;
    for (let i = 0; i < items.length; i++) {
      if (items[i].name.includes('.css')) {
        let cssFrom = fs.createReadStream(
          path.join(STYLES_DIR, items[i].name),
          'utf-8'
        );
        cssFrom.pipe(cssTo);
      }
    }
  });
}

cssBundler(OUTPUT_DIR);

fs.mkdir(OUTPUT_DIR, { recursive: true }, (err) => {
  if (err) throw err;
});

let indexHtml = fs.createWriteStream(path.join(DEST_HTML));
let tempHtml = fs.createReadStream(path.join(SRC_HTML), 'utf-8');
tempHtml.on('data', (data) => {
  let handledHtml = data.toString();
  let compoTags = handledHtml.match(/{{(.*)}}/gi);
  Promise.all(
    compoTags.map(async (item) => {
      let tagNames = item.split('{')[2];
      tagNames= tagNames.split('}')[0];
      let component = await fsP.readFile(
        path.join(COMPONENTS_DIR, `${tagNames}.html`)
      );
      return (handledHtml = handledHtml.replace(item, component.toString()));
    })
  ).then(function () {
    indexHtml.write(handledHtml);
  });
});
