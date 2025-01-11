
const shell = require('bin/helpers/terminal/shell');
const config = require('bin/config');

const { mainBranch } = config.sites.origin;

const gitCheckoutMain = () => shell(`git checkout ${mainBranch}`);

module.exports = gitCheckoutMain;