const chalk = require('chalk');
const path = require('path');

const checkIfFolderExists = require('bin/helpers/folder/checkIfFolderExists');
const copyFiles = require('bin/helpers/file/copyFiles');
const output = require('bin/helpers/terminal/output');
const renameFiles = require('bin/helpers/file/renameFiles');
const replaceText = require('bin/helpers/file/replaceText');
const exitApp = require('bin/helpers/terminal/exitApp');
const successMessage = require('bin/helpers/terminal/successMessage');
const goToFolder = require('bin/helpers/folder/goToFolder');

const config = require('bin/config.json');

const { 
    validateApplicationFolder, 
    validateApplicationName, 
    validateAuthor,
    validateConfiguration, 
    validateContent,
    validateGit,
    validateRemote, 
    validateUpstream,
    validateWorkspace 
} = require('./validate');

const TEMPLATE_FOLDER = config.templateFolder;

const createSite = async (argv) => {
    const { main = 'main', repository, site } = argv;

    const applicationFolder = path.join(process.cwd(), site);

    validateApplicationName(site);
    await validateApplicationFolder(site);
    
    copyFiles(path.resolve(TEMPLATE_FOLDER), applicationFolder);

    const folderExists = checkIfFolderExists(site);

    if (folderExists) {
        successMessage(`Folder for site ${chalk.blue(`"${site}"`)} was successfully created.`);
    } else {
        errorMessage(`Failed to create a project folder for site ${chalk.green(`"${applicationName}"`)}`);

        exitApp();
    }

    await validateConfiguration(site, main);
    await validateWorkspace(site);

    renameFiles(applicationFolder, 'jhbase', site);

    replaceText(applicationFolder, 'jhbase', site);
    replaceText(applicationFolder, 'Jhbase', site);
    
    await goToFolder({ folder: site });
    await validateGit(site);
    await validateAuthor();
    await validateUpstream(site);
    await validateRemote('origin', repository);
    await validateContent(site);
    await goToFolder({ folder: '..' });

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