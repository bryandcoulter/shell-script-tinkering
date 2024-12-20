module.exports = (fn) => async (argv) => {
    const output = await fn(argv);

    if (typeof output !== 'undefined') {
        console.log(output);
    }
};