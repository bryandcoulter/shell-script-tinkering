exports.command = 'site <command>'

exports.describe = 'Site command shortcuts'

exports.builder = yargs =>
    yargs
        .commandDir('commands', { recurse: true });

exports.handler = () => {};