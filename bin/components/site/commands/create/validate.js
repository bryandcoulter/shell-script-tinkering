const path = require('path');
const chalk = require('chalk');
const inquirer = require('@inquirer/prompts');
const validateProjectName = require('validate-npm-package-name');

const checkIfFolderExists = require('helpers/folder/checkIfFolderExists');

const removeFolder = require('helpers/folder/removeFolder');
const writeToFile = require('helpers/file/writeToFile');
const exitApp = require('helpers/terminal/exitApp');
const alertMessage = require('helpers/terminal/alertMessage');
const errorMessage = require('helpers/terminal/errorMessage');
const successMessage = require('helpers/terminal/successMessage');
const shell = require('helpers/terminal/shell');

const config = require('config.json');
const readFile = require('helpers/file/readFile');

const { EXIT, KEEP, REMOVE } = require('./constants');
const gitRemoveRemote = require('helpers/git/gitRemoveRemote');
const gitAddRemote = require('helpers/git/gitAddRemote');
const gitRemoteExists = require('helpers/git/gitRemoteExists');
const gitRemoteUrl = require('helpers/git/gitRemoteUrl');

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

const validateConfiguration = async (applicationName, mainBranch) => {
    const { remotes } = config;

    let addedToConfig = false;
    let modifiedRemotes = {
        ...remotes
    };

    if (applicationName in remotes) {
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
            delete modifiedRemotes[applicationName];
        } else if (answer === EXIT) {
            exitApp();
        }
    }

    if (!(applicationName in modifiedRemotes)) {
        modifiedRemotes[applicationName] = {
            mainBranch
        };

        addedToConfig = true;
    }

    const modifiedConfig = {
        ...config,

        remotes: modifiedRemotes
    }

    const configFilePath = path.join(process.cwd(), NODE_PATH, 'config.json');

    writeToFile(configFilePath, JSON.stringify(modifiedConfig, ' ', 4));

    const updatedConfig = JSON.parse(readFile(configFilePath));
    
    if (!(applicationName in updatedConfig.remotes)) {
        errorMessage(`Configuration for ${chalk.green(`"${applicationName}"`)} failed`);

        exitApp();
    }

    const actionWord = addedToConfig ? 'added' : 'found';

    successMessage(`Configuration for ${chalk.blue(`"${applicationName}"`)} was ${actionWord} successfully`);
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

module.exports = {
    validateApplicationFolder,
    validateApplicationName,
    validateConfiguration,
    validateRemote
}