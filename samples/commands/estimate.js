
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const client = rskapi.client(config.host);

const from = utils.getAccount(config, process.argv[2]);
const to = utils.getAddress(config, process.argv[3]);
let fn = process.argv[4];
let args;

let value;

if (isValue(fn)) {
    value = utils.getValue(fn);
    fn = null;
}
else 
    args = utils.getArguments(config, process.argv[5]);

const options = utils.getConfigurationOptions(config);

options.value = value;

function isValue(text) {
    const ch = text[0];
    
    return ch >= '0' && ch <= '9';
}

(async function() {
    try {
        const result = await client.estimate(
            from, 
            to, 
            fn, 
            args,
            options
        );
        
        if (result && result.message)
            throw result.message;
        
        console.log('estimated gas', utils.getValue(result));
    }
    catch (ex) {
        console.log(ex);
    }
})();

