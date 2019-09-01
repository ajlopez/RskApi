
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

const tx = {
    to: receiver,
    value: value,
    gas: config.options.gas || 100000,
    gasPrice: config.options.gasPrice || 60000000
};

const host = rskapi.host(config.host);

(async function() {
    const txh = await txs.send(host, sender, tx);
    console.log('transaction', txh);
    await txs.receipt(host, txh);
    console.log('done');
})();

