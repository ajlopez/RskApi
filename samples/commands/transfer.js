
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const from = process.argv[2];
const to = process.argv[3];
const value = utils.getValue(process.argv[4]);
const gas = process.argv[5] ? parseInt(process.argv[5]) : 0;

const sender = utils.getAccount(config, from);
const receiver = utils.getAddress(config, to);

const client = rskapi.client(config.host);

const options = utils.getConfigurationOptions(config);

if (gas)
    options.gas = gas;

(async function() {
    try {
        const txh = await client.transfer(sender, receiver, value, options);
        console.log('transaction', txh);
        const txr = await client.receipt(txh, 0);
        
        console.log(parseInt(txr.status) ? 'done' : 'failed');
    }
    catch (ex) {
        console.log(ex);
    }
})();

