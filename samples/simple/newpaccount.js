
var rskapi = require('../..');

var host = rskapi.host(process.argv[2]);
var passphrase = process.argv[2];

host.newPersonalAccount(passphrase, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.dir(data);
});


