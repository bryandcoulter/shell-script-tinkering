const shell = require('shelljs');

module.exports = (command, options = { silent: true }) => {
    const exec = shell.exec(command, options);

    console.log(command);

    return (exec.stdout || exec.stderr).replace(/[\n\r]$/g, '');
}