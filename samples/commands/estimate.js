
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const client = rskapi.client(config.host);

const from = utils.getAccount(config, process.argv[2]);
const to = utils.getInstanceAddress(config, process.argv[3]);
const fn = process.argv[4];
let args = utils.getArguments(config, process.argv[5]);

const options = utils.getConfigurationOptions(config);

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

