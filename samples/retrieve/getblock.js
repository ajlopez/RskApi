
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const hash = process.argv[2];

const client = rskapi.client(config.host);

(async function() {
    const block = await client.block(hash);
    
    console.log(JSON.stringify(block, null, 4));
})();

