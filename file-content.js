//cp -r jhbase test
const fs = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const capitalized =
args.app.charAt(0).toUpperCase()
  + args.app.slice(1)

const folderPath = path.resolve(__dirname, `./${args.app}`);

function replaceInFile(filePath, searchString, replaceString) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    const newData = data.replaceAll(searchString, replaceString);

    fs.writeFile(filePath, newData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }

      console.log('Replacement successful!');
    });
  });
}

// Example usage:



function findFiles(folderPath, oldString, newString) {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }
  
      files.forEach(file => {
        const filePath = path.join(folderPath, file);
  
        if (fs.statSync(filePath).isFile()) {
            replaceInFile(filePath, oldString, newString);
        }else {
          findFiles(filePath, oldString, newString);
      }
      });
    });
  }
  
  
  findFiles(folderPath, 'Jhbase', capitalized);
  