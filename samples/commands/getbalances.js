
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const client = rskapi.client(config.host);

(async function() {
    try {
        for (let n in config.accounts) {
            const address = utils.getAddress(config, n);
            const balance = await client.balance(address);
            console.log(n, address, parseInt(balance));
        }
        
        for (let n in config.instances) {
            const address = utils.getAddress(config, n);
            const balance = await client.balance(address);
            console.log(n, address, parseInt(balance));
        }
    }
    catch (ex) {
        console.log(ex);
    }
})();

