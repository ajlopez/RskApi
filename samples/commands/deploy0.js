
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

if (!config.instances)
    config.instances = {};

if (!config.options)
    config.options = {};

const from = process.argv[2];
const name = process.argv[3];
const contractname = process.argv[4];
let args = utils.getArguments(config, process.argv[5]);

const contract = require('./build/contracts/' + contractname + '.json');

const sender = utils.getAccount(config, from);

const client = rskapi.client(config.host);

(async function() {
    const txh = await client.deploy(sender, '0x', args);
    console.log('transaction', txh);
    const txr = await client.receipt(txh, 0);
    
    if (txr)
        console.log('address', txr.contractAddress);
    
    config.instances[name] = {
        address: txr.contractAddress,
        contract: contractname
    };
    
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    
    console.log('done');
})();

