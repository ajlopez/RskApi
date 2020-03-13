
const utils = require('./lib/utils');

const config = utils.loadConfiguration('./config.json');

const gas = parseInt(process.argv[2]);

config.options.gas = gas;

utils.saveConfiguration('./config.json', config);

