
const shell = require('bin/helpers/terminal/shell');

const gitAddChanges = ({ allowEmpty, message, noVerify }) => {
    const addMessage = message
        ? `-m '${ message }'`
        : '';

    const doAllowEmpty = allowEmpty
        ? '--allow-empty'
        : '';

    const doNoVerify = noVerify
        ? '--no-verify'
        : '';

    const output = shell(`git add . -A && git commit ${ addMessage } --no-edit ${ doAllowEmpty } ${ doNoVerify }`);

    return output;
};

module.exports = gitAddChanges;