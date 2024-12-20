
const gitRemoteUrl = require('helpers/git/gitRemoteUrl');

const gitRemoteExists = ({ remote }) => {
    const output = gitRemoteUrl({remote});
    
    return output && !output.includes('error: No such remote')
};

module.exports = gitRemoteExists;