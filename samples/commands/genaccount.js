
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const name = process.argv[2];

const account = rskapi.account();

config.accounts[name] = account;
console.log('address', config.accounts[name].address);

utils.saveConfiguration('./config.json', config);

