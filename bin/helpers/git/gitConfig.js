const path = require('path');

const shell = require('bin/helpers/terminal/shell');

const gitConfig = ({ key }) => {
    const root = path.join(process.cwd());
    const gitConfigPath = path.resolve(root, `./.git/config`);

    return shell(`git config --file "${gitConfigPath}" ${key}`);
}

module.exports = gitConfig;