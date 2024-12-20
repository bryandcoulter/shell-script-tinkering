const chalk = require('chalk');

const alertMessage = (message) => {
    console.info(
        chalk.yellow(
            `\n❗ ${message}\n`
        )
    );
}

module.exports = alertMessage;