const path = require('path');
const chalk = require('chalk');
const inquirer = require('@inquirer/prompts');
const validateProjectName = require('validate-npm-package-name');

const checkIfFolderExists = require('bin/helpers/folder/checkIfFolderExists');

const removeFolder = require('bin/helpers/folder/removeFolder');
const writeToFile = require('bin/helpers/file/writeToFile');
const exitApp = require('bin/helpers/terminal/exitApp');
const alertMessage = require('bin/helpers/terminal/alertMessage');
const errorMessage = require('bin/helpers/terminal/errorMessage');
const successMessage = require('bin/helpers/terminal/successMessage');
const shell = require('bin/helpers/terminal/shell');

const config = require('bin/config.json');
const readFile = require('bin/helpers/file/readFile');

const { EXIT, KEEP, REMOVE } = require('./constants');
const gitRemoveRemote = require('bin/helpers/git/gitRemoveRemote');
const gitAddRemote = require('bin/helpers/git/gitAddRemote');
const gitCommit = require('bin/helpers/git/gitCommit');
const gitConfig = require('bin/helpers/git/gitConfig');
const gitInit = require('bin/helpers/git/gitInit');
const gitLog = require('bin/helpers/git/gitLog');
const gitRemoteExists = require('bin/helpers/git/gitRemoteExists');
const gitRemoteUrl = require('bin/helpers/git/gitRemoteUrl');

const package = require('package.json');
const gitAddAuthor = require('bin/helpers/git/gitAddAuthor');

const NODE_PATH = process.env.NODE_PATH;

const { confirm, select } = inquirer;

const validateApplicationFolder = async (applicationName) => {
    let folderExists = false;
    let retry = true;

    while (retry) {
        folderExists = checkIfFolderExists(applicationName);

        if (folderExists) {
            errorMessage(`Cannot create a project named ${chalk.green(`"${applicationName}"`)} because a folder with that name already exists.`);

            const answer = await confirm({ 
                default: false,
                message: 'Do you want to remove the existing folder and try again?'
            });        

            if (!answer) {
                exitApp();
            }

            removeFolder({ folder: applicationName, recursive: true });
        } else {
            retry = false;
        }
    }
};

const validateApplicationName = (applicationName) => {
    const validationResult = validateProjectName(applicationName);

    if (!validationResult.validForNewPackages) {
        errorMessage(`Cannot create a project named ${chalk.green(`"${applicationName}"`)} because of npm naming restrictions:`);

        [
            ...(validationResult.errors || []),
            ...(validationResult.warnings || []),
        ].forEach((error) => {
            console.error(chalk.red(`  * ${error}`));
        });

        console.error(chalk.red('\nPlease choose a different project name.'));

        exitApp();
    }
};

const validateAuthor = async () => {
    let userName = await gitConfig({ key: 'user.name' }) || undefined;
    let userEmail = await gitConfig({ key: 'user.email' }) || undefined;

    const authorConfigExists = userName || userEmail;

    let added = false;

    if (authorConfigExists) {
        alertMessage(`Git is already configured ${chalk.green(`"${userName}" (${userEmail})`)} as the author.`);

        const answer = await select({ 
            choices: [
                { value: REMOVE, name: 'Remove config' },
                { value: KEEP, name: 'Keep config' },
                { value: EXIT, name: 'Exit' },
            ],

            message: 'What do you want to do next?'
        });     
        
        if (answer === REMOVE) {
            added = true;
        } else if (answer === EXIT) {
            exitApp();
        }
    }

    if (!authorConfigExists || added) {
        await gitAddAuthor({ email: 'madamovsky@jackhenry.com', name: 'Milan Adamovsky' })
    }

    userName = await gitConfig({ key: 'user.name' });
    userEmail = await gitConfig({ key: 'user.email' });

    const actionWord = added ? 'added' : 'found';

    successMessage(`Author "${userName}" (${userEmail}) was ${actionWord} successfully.`);
};

const validateConfiguration = async (applicationName, mainBranch) => {
    const { sites } = config;

    let addedToConfig = false;
    let modifiedSites = {
        ...sites
    };

    if (applicationName in sites) {
        alertMessage(`Configuration for ${chalk.green(`"${applicationName}"`)} already exists`);

        const answer = await select({ 
            choices: [
                { value: REMOVE, name: 'Remove configuration' },
                { value: KEEP, name: 'Keep configuration' },
                { value: EXIT, name: 'Exit' },
            ],

            message: 'What do you want to do next?'
        });     
        
        if (answer === REMOVE) {
            delete modifiedSites[applicationName];
        } else if (answer === EXIT) {
            exitApp();
        }
    }

    if (!(applicationName in modifiedSites)) {
        modifiedSites[applicationName] = {
            mainBranch
        };

        addedToConfig = true;
    }

    const modifiedConfig = {
        ...config,

        sites: modifiedSites
    }

    const configFilePath = path.join(process.cwd(), NODE_PATH, 'bin/config.json');

    writeToFile(configFilePath, JSON.stringify(modifiedConfig, ' ', 4));

    const updatedConfig = JSON.parse(readFile(configFilePath));
    
    if (!(applicationName in updatedConfig.sites)) {
        errorMessage(`Configuration for ${chalk.green(`"${applicationName}"`)} failed`);

        exitApp();
    }

    const actionWord = addedToConfig ? 'added' : 'found';

    successMessage(`Configuration for ${chalk.blue(`"${applicationName}"`)} was ${actionWord} successfully`);
};

const validateContent = async (applicationName) => {
    const log = await gitLog();

    const commitsExists = !/fatal: your current branch '.+' does not have any commits yet/.test(log);

    let added = false;

    if (commitsExists) {
        alertMessage(`The site ${chalk.green(`"${applicationName}"`)} already has commits.`);

        const answer = await select({ 
            choices: [
                { value: REMOVE, name: 'Remove all commits' },
                { value: KEEP, name: 'Keep all commits' },
                { value: EXIT, name: 'Exit' },
            ],

            message: 'What do you want to do next?'
        });     
        
        if (answer === REMOVE) {
            added = true;
        } else if (answer === EXIT) {
            exitApp();
        }
    }

    if (!commitsExists || added) {
        await gitCommit({ message: 'Initial commit' })
    }

    if (commitsExists && added) {
        await gitSquashAll({ message: 'Initial commit' });
    }

    const actionWord = added ? 'added' : 'found';

    successMessage(`Content for ${chalk.blue(`"${applicationName}"`)} was ${actionWord} successfully`);
};

const validateGit = async (site) => {
    const gitFolder = `${site}/.git`;
    const folderExists = checkIfFolderExists(gitFolder);

    if (folderExists) {
        alertMessage(`It appears that ${chalk.green(`"${site}"`)} is already git enabled.`);
        
        const answer = await select({ 
            choices: [
                { value: REMOVE, name: 'Remove git configurations' },
                { value: KEEP, name: 'Keep git configurations' },
                { value: EXIT, name: 'Exit' },
            ],

            message: 'What do you want to do next?'
        });     
        
        if (answer === REMOVE) {
            removeFolder({ folder: gitFolder, recursive: true });
        } else if (answer === EXIT) {
            exitApp();
        }
    }

    if (!checkIfFolderExists(gitFolder)) {
        await gitInit()
    }

    if (checkIfFolderExists(gitFolder)) {
        successMessage(`Site ${chalk.blue(`"${site}"`)} was configured successfully for git`);
    }
};

const validateRemote = async (remote, url) => {
    const remoteExists = gitRemoteExists({remote});
    const remoteUrl = gitRemoteUrl({remote});

    if (remoteExists) {
        alertMessage(`The remote ${chalk.green(`"${remote}"`)} already exists with url ${chalk.green(`"${remoteUrl}"`)}.`);
        
        const answer = await select({ 
            choices: [
                { value: REMOVE, name: 'Remove remote' },
                { value: KEEP, name: 'Keep remote' },
                { value: EXIT, name: 'Exit' },
            ],

            message: 'What do you want to do next?'
        });     
        
        if (answer === REMOVE) {
            gitRemoveRemote({remote});
        } else if (answer === EXIT) {
            exitApp();
        }
    }

    if (!gitRemoteExists({remote})) {
        gitAddRemote({remote, url});
    }

    if (gitRemoteExists({remote})) {
        successMessage(`Remote ${chalk.blue(`"${remote}"`)} was configured successfully with url ${chalk.blue(`"${url}"`)}`);
    }
};

const validateUpstream = async (site, remote = 'origin') => {
    const { sites } = config;

    const MAIN_BRANCH = sites[site]?.mainBranch;

    shell(`git push --set-upstream origin ${MAIN_BRANCH}`);

    successMessage(`Remote ${chalk.blue(`"${remote}"`)} for site ${chalk.blue(`"${site}"`)} was configured successfully`);
};

const validateWorkspace = async (applicationName) => {
    const { workspaces } = package;

    const modifiedWorkspaces = [
        ...workspaces
    ];

    let addedToConfig = false;

    const workspaceIndex = workspaces.indexOf(applicationName);
    const workspaceExists = workspaceIndex > -1;

    if (workspaceExists) {
        alertMessage(`The workspace ${chalk.green(`"${applicationName}"`)} already exists.`);

        const answer = await select({ 
            choices: [
                { value: REMOVE, name: 'Remove workspace' },
                { value: KEEP, name: 'Keep workspace' },
                { value: EXIT, name: 'Exit' },
            ],

            message: 'What do you want to do next?'
        });     
        
        if (answer === REMOVE) {
            modifiedWorkspaces.splice(workspaceIndex, 1)
        } else if (answer === EXIT) {
            exitApp();
        }
    }

    if (modifiedWorkspaces.indexOf(applicationName) < 0) {
        modifiedWorkspaces.push(applicationName);

        addedToConfig = true;
    }

    const modifiedConfig = {
        ...package,

        workspaces: modifiedWorkspaces
    }

    const packageFilePath = path.join(process.cwd(), NODE_PATH, 'package.json');

    writeToFile(packageFilePath, JSON.stringify(modifiedConfig, ' ', 4));

    const updatedConfig = JSON.parse(readFile(packageFilePath));
    
    if (updatedConfig.workspaces.indexOf(applicationName) < 0) {
        errorMessage(`Workspace configuration for ${chalk.green(`"${applicationName}"`)} failed`);

        exitApp();
    }

    const actionWord = addedToConfig ? 'added' : 'found';

    successMessage(`Workspace for ${chalk.blue(`"${applicationName}"`)} was ${actionWord} successfully`);
};

module.exports = {
    validateApplicationFolder,
    validateApplicationName,
    validateAuthor,
    validateConfiguration,
    validateContent,
    validateGit,
    validateRemote,
    validateUpstream,
    validateWorkspace
}