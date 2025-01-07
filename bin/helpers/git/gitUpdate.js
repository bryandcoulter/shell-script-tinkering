const shell = require('bin/helpers/terminal/shell');
const gitCheckoutMain = require('bin/helpers/git/gitCheckoutMain');

const ORIGIN = process.env.ORIGIN;
const { mainBranch } = config.sites.origin;

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