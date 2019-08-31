
const fs = require('fs');

let config;

try {
    config = require('./config.json');
}
catch (ex) {
    config = {};
}

const host = process.argv[2];

config.host = host;

fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));

