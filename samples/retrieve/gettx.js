
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const hash = process.argv[2];

const client = rskapi.client(config.host);

(async function() {
    const tx = await client.transaction(hash);
    
    console.log(JSON.stringify(tx, null, 4));
})();

