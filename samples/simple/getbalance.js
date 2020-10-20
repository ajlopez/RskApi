
const rskapi = require('../..');

const host = rskapi.host(process.argv[2]);
const address = process.argv[3];
const block = process.argv[4];

if (block)
    host.getBalance(address, block, function (err, data) {
        if (err)
            console.log('error', err);
        else
            console.dir(data);
    });
else
    host.getBalance(address, function (err, data) {
        if (err)
            console.log('error', err);
        else
            console.dir(data);
    });


