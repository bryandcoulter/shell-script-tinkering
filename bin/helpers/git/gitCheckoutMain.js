
const shell = require('helpers/terminal/shell');
const config = require('config');

const { mainBranch } = config.remotes.origin;

const gitCheckoutMain = () => shell(`git checkout ${mainBranch}`);

module.exports = gitCheckoutMain;