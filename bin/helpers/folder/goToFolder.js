const process = require('process');
const path = require('path');

const goToFolder = ({ folder }) => {
    const root = path.join(process.cwd());

    const destinationFolder = path.resolve(`${root}/${folder}`);

    process.chdir(destinationFolder);
};

module.exports = goToFolder;