const site = require('./site');

module.exports = yargs =>
    yargs
        .command(site);