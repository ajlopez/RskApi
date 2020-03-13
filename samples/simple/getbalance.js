
const rskapi = require('../..');

const host = rskapi.host(process.argv[2]);
const address = process.argv[3];

host.getBalance(address, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.dir(data);
});


