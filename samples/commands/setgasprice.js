
const fs = require('fs');

let config;

try {
    config = require('./config.json');
}
catch (ex) {
    config = {};
}

const gasPrice = parseInt(process.argv[2]);

if (!config.options)
    config.options = {};

config.options.gasPrice = gasPrice;

fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));

