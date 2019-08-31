
const rskapi = require('../..');

const fs = require('fs');

let config;

try {
    config = require('./config.json');
}
catch (ex) {
    config = {};
}

if (!config.accounts)
    config.accounts = {};

const name = process.argv[2];
const address = process.argv[3];

const host = rskapi.host(config.host);

if (address && address.length <= 2)
    (async function() {
        const accounts = await host.getAccounts();
        config.accounts[name] = accounts[parseInt(address)];
        
        console.log('address', config.accounts[name]);
        
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    })();
else {
    config.accounts[name] = address;
    console.log('address', config.accounts[name]);
}

