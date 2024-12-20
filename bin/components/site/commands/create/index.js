const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

const checkIfFolderExists = require('helpers/folder/checkIfFolderExists');
const copyFiles = require('helpers/file/copyFiles');
const output = require('helpers/terminal/output');
const renameFiles = require('helpers/file/renameFiles');
const replaceText = require('helpers/file/replaceText');
const shell = require('helpers/terminal/shell');
const exitApp = require('helpers/terminal/exitApp');
const successMessage = require('helpers/terminal/successMessage');

const config = require('config.json');

const { validateApplicationFolder, validateApplicationName, validateConfiguration, validateRemote } = require('./validate');

const TEMPLATE_FOLDER = config.templateFolder;

const createSite = async (argv) => {
    const { main, repository, site } = argv;

    const applicationFolder = path.join(process.cwd(), site);

    validateApplicationName(site);
    await validateApplicationFolder(site);
    await validateConfiguration(site, main);
    await validateRemote(site, repository)

    copyFiles(path.resolve(TEMPLATE_FOLDER), applicationFolder);

    const folderExists = checkIfFolderExists(site);

    if (folderExists) {
        successMessage(`Folder for site ${chalk.blue(`"${site}"`)} was successfully created.`);
    } else {
        errorMessage(`Failed to create a project folder for site ${chalk.green(`"${applicationName}"`)}`);

        exitApp();
    }

    renameFiles(applicationFolder, 'jhbase', site);

    replaceText(applicationFolder, 'jhbase', site);
    replaceText(applicationFolder, 'Jhbase', site);

    const output = successMessage(`Content for site ${chalk.blue(`"${site}"`)} was successfully converted.`);

    return output;
};

exports.command = 'create <site> <repository> [main]';

exports.default = createSite;

exports.describe = 'Initializes specified site';

exports.builder = {
    main: {
        default: 'main',
        describe: 'name of main branch',
        type: 'string'
    },

    repository: {
        describe: 'URL of git repository',
        type: 'string'
    },

    site: {
        describe: 'Name of site to create',
        type: 'string'
    }
};

exports.handler = output(createSite);