const chalk = require('chalk');

const errorMessage = (message) => {
    console.error(
        chalk.red(
            `\n❌ ${message}\n`
        )
    );
}

module.exports = errorMessage;