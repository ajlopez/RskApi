
const utils = require('./lib/utils');

const config = utils.loadConfiguration('./config.json');

const host = process.argv[2];

config.host = host;

utils.saveConfiguration('./config.json', config);

