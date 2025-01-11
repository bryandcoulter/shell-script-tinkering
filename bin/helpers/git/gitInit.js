
const shell = require('bin/helpers/terminal/shell');

const gitInit = ({ branch = 'main', folder = '.' } = {}) => shell(`git init -b ${branch} ${folder}`);

module.exports = gitInit;