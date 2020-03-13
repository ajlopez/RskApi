
const rskapi = require('../..');

const host = rskapi.host(process.argv[2]);
const hash = process.argv[3];
const address = process.argv[4];

host.getStorageAt(hash, address, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.dir(data);
});


