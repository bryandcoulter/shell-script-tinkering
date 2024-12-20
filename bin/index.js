const yargs = require('yargs');

require('dotenv').config();

const enhancedYargs = require('./components')(yargs);

enhancedYargs
    .help()
    .argv;