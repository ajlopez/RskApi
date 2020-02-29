
const rskapi = require('../..');
const utils = require('./lib/utils');
const txs = require('./lib/txs');

let config;

try {
    config = require('./config.json');
}
catch (ex) {
    config = {};
}

if (!config.options)
    config.options = {};

const from = process.argv[2];
const to = process.argv[3];
const value = utils.getValue(process.argv[4]);

const sender = utils.getAccount(config, from);
const receiver = utils.getAddress(config, to);

const client = rskapi.client(config.host);

(async function() {
    const txh = await client.transfer(sender, receiver, value);
    console.log('transaction', txh);
    const txr = await client.receipt(txh, 0);
    
    console.log(parseInt(txr.status) ? 'done' : 'failed');
})();

