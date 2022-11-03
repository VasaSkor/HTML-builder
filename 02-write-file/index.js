const fs = require('fs');
const path = require('path');
const readline = require('readline');

const interfaceConsole = readline.createInterface({
  prompt: 'Write text: ',
  input: process.stdin,
  output: process.stdout
});

const write = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));

const closeProgram = () =>{
  process.stdout.write('\nProgram close');
  write.close();
  interfaceConsole.close();
};
interfaceConsole.on('line', str => {
  if (str === 'exit') {
    closeProgram();
    return;
  }
  
  write.write(str + '\n');
});


interfaceConsole.on('SIGINT', () => {
  closeProgram();
});


interfaceConsole.prompt();


