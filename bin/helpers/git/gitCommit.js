
const shell = require('bin/helpers/terminal/shell');

const gitCommit = ({ allowEmpty,  message, noVerify }) => {
    const doAllowEmpty = allowEmpty
    ? '--allow-empty'
    : '';

    const doNoVerify = noVerify
        ? '--no-verify'
        : '';

    const addMessage = message
        ? `-m '${ message }'`
        : ''

    return shell(`git add . -A && git commit ${ addMessage } --no-edit ${ doAllowEmpty } ${ doNoVerify }`);
};

module.exports = gitCommit;