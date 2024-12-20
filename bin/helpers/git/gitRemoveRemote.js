
const shell = require('helpers/terminal/shell');

const gitRemoveRemote = ({ remote }) => shell(`git remote remove ${remote}`);

module.exports = gitRemoveRemote;