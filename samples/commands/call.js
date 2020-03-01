
const rskapi = require('../..');
const utils = require('./lib/utils');

const config = utils.loadConfiguration('./config.json');

const from = utils.getAddress(config, process.argv[2]);
const to = utils.getInstanceAddress(config, process.argv[3]);
const fn = process.argv[4];
let args = utils.getArguments(config, process.argv[5]);

const client = rskapi.client(config.host);

(async function() {
    const result = await client.call(from, to, fn, args);
    console.log('result', result);
})();

