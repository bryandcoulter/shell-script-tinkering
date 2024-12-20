const shell = require('helpers/terminal/shell');
const gitCheckoutMain = require('helpers/git/gitCheckoutMain');

const ORIGIN = process.env.ORIGIN;
const { mainBranch } = config.remotes.origin;

const UPSTREAM = process.env.UPSTREAM;

const gitUpdate = () => {
    const output = [
        shell(`git fetch --all`),
        shell(`git rebase ${ORIGIN}/${mainBranch} ${mainBranch}`),
        shell(`git rebase ${UPSTREAM}/${UPSTREAM_MAIN_BRANCH} upstream_main`),
        gitCheckoutMain()
    ];

    return output
        .filter(Boolean)
        .join('\n');
}

module.exports = gitUpdate;