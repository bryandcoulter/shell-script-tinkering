const fs = require('fs');
const path = require('path');

const renameFile = (oldPath, newPath) => {
    fs.renameSync(oldPath, newPath, (err) => {
        if (err) {
            console.error('Error renaming file:', err);
        } else {
            console.log('Renamed:', oldPath, '->', newPath);
        }
    });
}

const renameFiles = (folderPath, oldString, newString) => {
    const files = fs.readdirSync(folderPath);

        // if (err) {
        //     console.error('Error reading directory:', err);
        //     return;
        // }

    files.forEach(file => {
        const filePath = path.join(folderPath, file);

        if (fs.statSync(filePath).isFile()) {
            if (file.includes(oldString)) {
                const newFileName = file.replace(oldString, newString);
                const newFilePath = path.join(folderPath, newFileName);

                renameFile(filePath, newFilePath);
            }
        } else {
            renameFiles(filePath, oldString, newString);
        }
    });
}

module.exports = renameFiles;