
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const hash = process.argv[2];

const client = rskapi.client(config.host);

(async function() {
    const txr = await client.receipt(hash);
    
    console.log(JSON.stringify(txr, null, 4));
})();

