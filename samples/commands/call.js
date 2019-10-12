
const rskapi = require('../..');
const simpleabi = require('simpleabi');
const utils = require('./lib/utils');
const txs = require('./lib/txs');

let config;

try {
    config = require('./config.json');
}
catch (ex) {
    config = {};
}

if (!config.instances)
    config.instances = {};

if (!config.options)
    config.options = {};

const from = utils.getAddress(config, process.argv[2]);
const to = utils.getInstanceAddress(config, process.argv[3]);
const fn = process.argv[4];
let args = utils.getArguments(config, process.argv[5]);

const tx = {
    from: from,
    to: to,
    value: 0,
    gas: config.options.gas || 5000000,
    gasPrice: config.options.gasPrice || 60000000,
    data: '0x' + simpleabi.encodeCall(fn, args)
};

const host = rskapi.host(config.host);

(async function() {
    const result = await txs.call(host, tx);
    console.log('result', result);
})();

