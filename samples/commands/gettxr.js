
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const hash = process.argv[2];
const property = process.argv[3];

const client = rskapi.client(config.host);

(async function() {
    const txr = await client.receipt(hash);
    
    if (property)
        console.log(property, utils.getValue(txr[property]));
    else
        console.log(JSON.stringify(txr, null, 4));
})();

