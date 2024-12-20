const output = require('helpers/terminal/output');
const shell = require('helpers/terminal/shell');

const config = require('config.json');

const updateSite = (argv) => {
    const { site } = argv;

    console.log('Updating site: ', site);

    return output;
};

exports.command = 'update <site> <repo> <branch>';

exports.default = updateSite;

exports.describe = 'Updates specified site';

exports.builder = {
    site: {
        describe: 'Name of site to update',
        type: 'string'
    }
};

exports.handler = output(updateSite);