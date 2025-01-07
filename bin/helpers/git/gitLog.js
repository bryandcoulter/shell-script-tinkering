
const shell = require('bin/helpers/terminal/shell');

const gitLog = () => shell(`git log`);

module.exports = gitLog;