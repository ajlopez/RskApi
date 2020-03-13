
const rskapi = require('../..');

const host = rskapi.host(process.argv[2]);
const number = process.argv[3];

host.getBlockByNumber(number, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.dir(data);
});


