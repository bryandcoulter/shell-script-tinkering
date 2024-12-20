const fs = require('fs-extra');
const path = require('path');

const checkIfFolderExists = (folder) => fs.existsSync(path.join(process.cwd(), folder));

module.exports = checkIfFolderExists;