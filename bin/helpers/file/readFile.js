const fs = require('fs');

const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');

module.exports = readFile;