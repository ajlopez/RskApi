
const rskapi = require('../..');

const host = rskapi.host(process.argv[2]);
const number = process.argv[3];

let properties = process.argv[4];

if (properties)
    properties = properties.split(',');

host.getBlockByNumber(number, function (err, data) {
	if (err)
		console.log('error', err);
	else {
        if (properties)
            for (let n in properties)
                console.log(properties[n], data[properties[n]]);
        else
            console.dir(data);
    }
});


