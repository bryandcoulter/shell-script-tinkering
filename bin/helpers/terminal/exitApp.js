const chalk = require('chalk');

const exitApp = () => {
    console.error(
        chalk.green(
            `\nThank you for using this tool. Goodbye!\n`
        )
    );

    process.exit(1);
}

module.exports = exitApp;