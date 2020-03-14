
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const client = rskapi.client(config.host);

const from = utils.getAccount(config, process.argv[2]);
const to = utils.getInstanceAddress(config, process.argv[3]);
const fn = process.argv[4];
let args = utils.getArguments(config, process.argv[5]);

(async function() {
    try {
        const txh = await client.invoke(from, to, fn, args);
        console.log('transaction', txh);
        const txr = await client.receipt(txh, 0);
        console.log(txr && parseInt(txr.status) ? 'done' : 'failed');
    }
    catch (ex) {
        console.log(ex);
    }
})();

