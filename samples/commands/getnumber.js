
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const client = rskapi.client(config.host);

(async function() {
    const number = await client.number();
    
    console.log(JSON.stringify(number, null, 4));
})();

