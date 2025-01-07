const path = require('path');

const shell = require('bin/helpers/terminal/shell');

const gitAddAuthor = ({ email = '', name = '' }) => {
    const root = path.join(process.cwd());
    const gitConfigPath = path.resolve(root, `./.git/config`);

    shell(`git config --add --file "${gitConfigPath}" user.name "${name}"`);
    shell(`git config --add --file "${gitConfigPath}" user.email "${email}"`);
}

module.exports = gitAddAuthor;