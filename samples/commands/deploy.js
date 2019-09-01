
const rskapi = require('../..');
const simpleabi = require('simpleabi');
const utils = require('./lib/utils');
const txs = require('./lib/txs');
const fs = require('fs');

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

const from = process.argv[2];
const name = process.argv[3];
const contractname = process.argv[4];
let args = process.argv[5];

if (args)
    args = args.split(',');

const contract = require('./build/contracts/' + contractname + '.json');

const sender = utils.getAccount(config, from);

const tx = {
    value: 0,
    gas: config.options.gas || 5000000,
    gasPrice: config.options.gasPrice || 60000000,
    data: contract.bytecode + simpleabi.encodeValues(args)
};

const host = rskapi.host(config.host);

(async function() {
    const txh = await txs.send(host, sender, tx);
    console.log('transaction', txh);
    const txr = await txs.receipt(host, txh);
    
    if (txr)
        console.log('address', txr.contractAddress);
    
    config.instances[name] = {
        address: txr.contractAddress,
        contract: contractname
    };
    
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    
    console.log('done');
})();

