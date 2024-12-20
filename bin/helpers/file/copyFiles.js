const fs = require('fs-extra');
const path = require('path');

const copyFiles = (from, to) => {
    fs.copySync(path.resolve(from), to, {overwrite: true});
};

module.exports = copyFiles;