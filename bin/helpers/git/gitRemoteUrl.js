
const shell = require('helpers/terminal/shell');

const gitRemoteUrl = ({ remote }) => shell(`git remote get-url ${remote}`);

module.exports = gitRemoteUrl;