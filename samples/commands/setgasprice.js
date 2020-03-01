
const utils = require('./lib/utils');

const config = utils.loadConfiguration('./config.json');

const gasPrice = parseInt(process.argv[2]);

config.options.gasPrice = gasPrice;

utils.saveConfiguration('./config.json', config);

