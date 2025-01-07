const chalk = require('chalk');

const output = require('bin/helpers/terminal/output');
const shell = require('bin/helpers/terminal/shell');

const config = require('bin/config.json');
const gitAddChanges = require('bin/helpers/git/gitAddChanges');
const gitCheckoutMain = require('bin/helpers/git/gitCheckoutMain');
const successMessage = require('bin/helpers/terminal/successMessage');

const goToFolder = require('bin/helpers/folder/goToFolder');
const gitPush = require('bin/helpers/git/gitPush');

const updateSite = async (argv) => {
    const { site } = argv;

    await goToFolder({ folder: site });

    const currentDate = new Date()
        .toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit', second: '2-digit'})
        .replace(/(\d+)\/(\d+)\/(\d+), (\d+)/, '$3$1$2-$4');
    
    await gitCheckoutMain();

    shell('git pull');

    const temporaryBranch = `${site}-${currentDate}`;

    shell(`git checkout -t -b ${ temporaryBranch }`);
    shell(`diff -ruN --exclude=.git ../jhbase . | patch -s -p0 -R`);

    await gitAddChanges({
        allowEmpty: true,
        noVerify: true
    });

    const todayDate = new Date()
        .toLocaleString('en-us', {
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        
    const message = `Updates added at ${todayDate}`;

    await gitAddChanges({
        allowEmpty: true,
        message,
        noVerify: true
    });

    await gitPush();

    const output = successMessage(`Content for site ${chalk.blue(`"${site}"`)} was successfully updated.`);

    return output;
};

exports.command = 'update <site>';

exports.default = updateSite;

exports.describe = 'Updates specified site';

exports.builder = {
    site: {
        describe: 'Name of site to update',
        type: 'string'
    }
};

exports.handler = output(updateSite);