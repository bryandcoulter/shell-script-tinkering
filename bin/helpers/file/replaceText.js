const fs = require('fs');
const path = require('path');
const readFile = require('helpers/file/readFile');

const replaceInFile = (filePath, searchString, replaceString) => {
    const data = readFile(filePath);

    const regex = new RegExp(searchString, 'g');

    const newData = data.replace(regex, replaceString);

    fs.writeFileSync(filePath, newData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }

        console.log('Replacement successful!');
    });
};

const replaceText = (folderPath, oldString, newString) => {
    const files = fs.readdirSync(folderPath)
    
        // if (err) {
        //     console.error('Error reading directory:', err);
        //     return;
        // }

    files.forEach(file => {
        const filePath = path.join(folderPath, file);

        if (fs.statSync(filePath).isFile()) {
            replaceInFile(filePath, oldString, newString);
        } else {
            replaceText(filePath, oldString, newString);
        }
    });
};

module.exports = replaceText;