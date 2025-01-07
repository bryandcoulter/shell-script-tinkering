
const shell = require('bin/helpers/terminal/shell');

const gitAddRemote = ({ remote, url }) => shell(`git remote add ${remote} ${url}`);

module.exports = gitAddRemote;