const chalk = require('chalk');

const successMessage = (message) => {
    console.info(
        chalk.green(
            `\n✅ ${message}`
        )
    );
}

module.exports = successMessage;