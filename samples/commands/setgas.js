
const fs = require('fs');

let config;

try {
    config = require('./config.json');
}
catch (ex) {
    config = {};
}

const gas = parseInt(process.argv[2]);

if (!config.options)
    config.options = {};

config.options.gas = gas;

fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));

