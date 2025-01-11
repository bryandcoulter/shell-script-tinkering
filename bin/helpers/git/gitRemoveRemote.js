
const shell = require('bin/helpers/terminal/shell');

const gitRemoveRemote = ({ remote }) => shell(`git remote remove ${remote}`);

module.exports = gitRemoveRemote;