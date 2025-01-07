
const shell = require('bin/helpers/terminal/shell');

const createInitialCommit = ({ branch, message = 'init' }) => {
    const output = shell(`git branch ${ branch } $(echo "${ message }" | git commit-tree HEAD^{tree})`);

    return output.replace(/\n/g, '');
};

module.exports = createInitialCommit;