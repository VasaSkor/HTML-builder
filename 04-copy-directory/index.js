const fs = require('fs');
const path = require('path');

const copyFile = (sourcePath, targetPath) => {
  fs.mkdir(targetPath, () => {});
  fs.readdir(sourcePath,
    { withFileTypes: true },
    (err, files) => {
      files.forEach((file) =>{
        const readStream =
          fs.createReadStream(path.resolve(sourcePath, file.name));
        const writeStream =
          fs.createWriteStream(path.resolve(targetPath, file.name));

        readStream.on('data', (chunk) => {
          writeStream.write(chunk);
        });
      });
    });
};

copyFile(
  path.resolve(__dirname, 'files'),
  path.resolve(__dirname, 'file-copy')
);