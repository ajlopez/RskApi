
var rskapi = require('../..');

var host = rskapi.host(process.argv[2]);
var hash = process.argv[3];
var address = process.argv[4];

if (typeof address === 'string' && address.substring(0, 2) != '0x')
	address = parseInt(address);

host.getStorageAt(hash, address, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.dir(data);
});


