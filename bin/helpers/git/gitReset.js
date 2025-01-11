
const shell = require('bin/helpers/terminal/shell');

const gitSquashAll = ({ message = 'Initial commit' }) => 
    shell(`git reset $(git commit-tree HEAD^{tree} -m "${message}")`);
;

module.exports = gitSquashAll;