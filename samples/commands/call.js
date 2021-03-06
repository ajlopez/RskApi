
const utils = require('./lib/utils');
const rskapi = utils.rskapi;
const simpleabi = require('simpleabi');

const config = utils.loadConfiguration('./config.json');

const from = utils.getAddress(config, process.argv[2]);
const to = utils.getInstanceAddress(config, process.argv[3]);
const fn = process.argv[4];

let args;
let otypes;

if (fn.indexOf('()') > 0) {
    args = [];
    otypes = process.argv[5];
}
else {
    args = utils.getArguments(config, process.argv[5]);
    otypes = process.argv[6];
}

if (otypes)
    otypes = otypes.split(',');
else
    otypes = [];

const client = rskapi.client(config.host);

const options = utils.getConfigurationOptions(config);

(async function() {
    try {
        let result = await client.call(from, to, fn, args, options);
        
        if (otypes.length)
            result = simpleabi.decodeValues(result, otypes);
        else if (result && result.length === 32 * 2 + 2)
            result = utils.getValue(result);
        
        console.log('result', result);
    }
    catch (ex) {
        console.log(ex);
    }
})();

