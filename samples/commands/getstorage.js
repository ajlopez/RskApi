
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const address = utils.getAddress(config, process.argv[2]);
const offset = process.argv[3];

console.log('address', address);
console.log('offset', offset);

const client = rskapi.client(config.host);

(async function() {
    try {
        let value = await client.storage(address, offset);
        
        // TODO review
        if (value === null)
            value = '0x0';
        
        console.log('value', value);
    }
    catch (ex) {
        console.log(ex);
    }
})();

