
const rskapi = require('../..');
const utils = require('./lib/utils');

const fs = require('fs');

let config;

try {
    config = require('./config.json');
}
catch (ex) {
    config = {};
}

if (!config.accounts)
    config.accounts = {};

const name = process.argv[2];
const account = utils.generateAccount();

const host = rskapi.host(config.host);

config.accounts[name] = account;
console.log('address', config.accounts[name].address);
fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));

