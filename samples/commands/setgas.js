
const utils = require('./lib/utils');

const config = utils.loadConfiguration('./config.json');

const gas = parseInt(process.argv[2]);

if (!config.options)
    config.options = {};

config.options.gas = gas;

utils.saveConfiguration('./config.json', config);

