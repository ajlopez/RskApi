
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const address = utils.getAddress(config, process.argv[2]);

console.log('address', address);

const client = rskapi.client(config.host);

(async function() {
    const nonce = await client.nonce(address);
    
    console.log('nonce', parseInt(nonce));
})();

