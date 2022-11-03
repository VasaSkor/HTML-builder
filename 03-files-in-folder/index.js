const fs = require('fs');
const path = require('path');

fs.readdir(path.resolve(__dirname, 'secret-folder'),
  {withFileTypes: true}, (err, files) => {
    files.forEach((value)=>{
      fs.stat(path.resolve(__dirname, 'secret-folder', value.name), (err, stats) =>{
        const fileName = path.parse(value.name).name;
        const fileExtension = path.parse(value.name).ext.split('.')[1];
        if(stats.isFile())
          process.stdout.write(`${fileName} - ${fileExtension} - ${stats.size}\n`);
      });
    });
  });