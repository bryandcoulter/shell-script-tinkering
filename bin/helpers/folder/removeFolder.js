const fs = require('fs-extra');
const path = require('path');

const removeFolder = ({ folder, recursive = false }) => {
    const root = path.join(process.cwd());

    const folderToRemove = path.resolve(`${root}/${folder}`);

    fs.rmSync(folderToRemove, {
        recursive
    });
};

module.exports = removeFolder;