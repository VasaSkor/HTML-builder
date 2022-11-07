const fs = require('fs');
const path = require('path');

const pathFile = path.resolve(__dirname, 'project-dist');
const templateFilePath = path.resolve(__dirname, 'template.html');
const regex = /\{\{(.*?)\}\}/g;

const htmlMerge = async () => {
  let templateString = await readFile(templateFilePath);
  const writeStream = fs.createWriteStream(path.resolve(pathFile, 'index.html'))
  let match;
  while ((match = regex.exec(templateString)) !== null) {
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    const component = await readFile(path.resolve(__dirname, 'components', `${match[1]}.html`));
    templateString = templateString.replace(match[0], component);
  }
  writeStream.write(templateString);
};

const readFile = (path) =>{
  return new Promise((resolve) => {
    const readStream = fs.createReadStream(path, 'utf-8');
    let data = '';
    readStream.on('data', chunk => {
      data += chunk.toString();
    });
    readStream.on('end', () => {
      resolve(data);
    });
  });
};

const copyFile = (sourcePath, targetPath) => {
  fs.rm(targetPath, {
    recursive: true
  }, () => {
    fs.mkdir(targetPath, () => {
      fs.readdir(sourcePath,
        { withFileTypes: true },
        (err, files) => {
          files.forEach((file) =>{
            if (!file.isFile()){
              copyFile(
                path.resolve(sourcePath, file.name),
                path.resolve(targetPath, file.name)
              );
              return;
            }
            const readStream =
              fs.createReadStream(path.resolve(sourcePath, file.name));
            const writeStream =
              fs.createWriteStream(path.resolve(targetPath, file.name));

            readStream.on('data', (chunk) => {
              writeStream.write(chunk);
            });
          });
        });
    });
  });
};

const mergeFile = (sourcePath, targetPath) => {
  const writeFile = fs.createWriteStream(path.resolve(targetPath, 'style.css'));
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

const buildPage = (distPath) => {
  fs.rmdir(distPath, () => {
    fs.mkdir(distPath, async () => {
      copyFile(
        path.resolve(__dirname, 'assets'),
        path.resolve(pathFile, 'assets')
      );
      mergeFile(path.resolve(__dirname, 'styles'),
        path.resolve(__dirname, 'project-dist/'));
      await htmlMerge();
    });
  });
};

buildPage(path.resolve(__dirname, 'project-dist/'));

