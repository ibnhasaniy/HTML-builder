const fs = require('fs');
const path = require('path');
const {
  stdin,
  stdout
} = process;
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const writebleStream = fs.createWriteStream(filePath);

fs.open(filePath, 'w', (err) => {
  if (err) throw err;
});
stdout.write('Please write your text here...\n');
stdin.read('data', filePath, err => console.log(err));

let rl = readline.Interface({
  input: stdin,
  output: stdout,
});

process.on('beforeExit', ()=>{
  stdout.write('\nGood bye!');
});

rl.on('line', (line) => {
  let isExit = line.toLowerCase() === 'exit';
  if (isExit) {
    stdout.write('Good bye!');
    process.exit();
  }
  writebleStream.write(line + '\n');
});