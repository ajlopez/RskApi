
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const name = process.argv[2];
const address = process.argv[3];

config.instances[name] = address;
console.log('address', config.instances[name]);

utils.saveConfiguration('./config.json', config);

