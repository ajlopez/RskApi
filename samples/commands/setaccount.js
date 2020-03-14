
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const name = process.argv[2];
const address = process.argv[3];

const client = rskapi.client(config.host);

if (address && address.length <= 2)
    (async function() {
        const accounts = await client.accounts();
        config.accounts[name] = accounts[parseInt(address)];
        
        console.log('address', config.accounts[name]);
        
        utils.saveConfiguration('./config.json', config);
    })();
else {
    config.accounts[name] = address;
    console.log('address', config.accounts[name]);
    
    utils.saveConfiguration('./config.json', config);
}

