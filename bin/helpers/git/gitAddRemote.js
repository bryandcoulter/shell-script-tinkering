
const shell = require('helpers/terminal/shell');

const gitAddRemote = ({ remote, url }) => shell(`git remote add ${remote} ${url}`);

module.exports = gitAddRemote;