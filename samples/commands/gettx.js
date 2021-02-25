
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const hash = process.argv[2];
const property = process.argv[3];

const client = rskapi.client(config.host);

(async function() {
    const tx = await client.transaction(hash);
    
    if (property)
        console.log(property, utils.getValue(tx[property]));
    else
        console.log(JSON.stringify(tx, null, 4));
})();

