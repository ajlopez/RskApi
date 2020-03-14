
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const client = rskapi.client(config.host);

(async function() {
    try {
        const gasPrice = parseInt(await client.host().getGasPrice());
        for (let n in config.accounts) {
            const address = utils.getAddress(config, n);
            const balance = await client.balance(address);
            console.log(n, address, parseInt(balance) / gasPrice);
        }
        
        for (let n in config.instances) {
            const address = utils.getAddress(config, n);
            const balance = await client.balance(address);
            console.log(n, address, parseInt(balance) / gasPrice);
        }
    }
    catch (ex) {
        console.log(ex);
    }
})();

