
const shell = require('bin/helpers/terminal/shell');

const gitPush = ({ force, remote = 'origin' } = {}) => {
    const forcePush = force
    ? '--force'
    : '';

    return shell(`git push ${ remote } ${ forcePush }`);
};

module.exports = gitPush;