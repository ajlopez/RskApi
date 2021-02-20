
const utils = require('./lib/utils');

const config = utils.loadConfiguration('./config.json');

const data = process.argv[2];

config.data = data;

utils.saveConfiguration('./config.json', config);

