const fs = require('fs');
const path = require('path');

const mergeFile = (sourcePath, targetPath) => {
  const writeFile = fs.createWriteStream(path.resolve(targetPath, 'bundle.css'));
  fs.readdir(sourcePath,{ withFileTypes: true },(err, files)=>{
    files.forEach((file) => {
      if (path.parse(file.name).ext === '.css') {
        const readFile = fs.createReadStream(path.resolve(sourcePath, file.name));
        readFile.on('data', (chunk) =>{
          writeFile.write(chunk);
        });
      }
    });
  });
};

mergeFile(path.resolve(__dirname, 'styles'),
  path.resolve(__dirname, 'project-dist'));