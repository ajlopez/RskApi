
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const from = process.argv[2];
const to = process.argv[3];
const value = utils.getValue(process.argv[4]);

const sender = utils.getAccount(config, from);
const receiver = utils.getAddress(config, to);

const client = rskapi.client(config.host);

(async function() {
    try {
        const txh = await client.transfer(sender, receiver, value);
        console.log('transaction', txh);
        const txr = await client.receipt(txh, 0);
        
        console.log(parseInt(txr.status) ? 'done' : 'failed');
    }
    catch (ex) {
        console.log(ex);
    }
})();

