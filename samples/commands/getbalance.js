
const rskapi = require('../..');
const utils = require('./lib/utils');

let config;

try {
    config = require('./config.json');
}
catch (ex) {
    config = {};
}

const address = utils.getAddress(config, process.argv[2]);

console.log('address', address);

const host = rskapi.host(config.host);

(async function() {
    const balance = await host.getBalance(address);
    
    console.log('balance', balance);
})();
