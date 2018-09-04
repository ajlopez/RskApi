
var rskapi = require('../..');

var host = rskapi.host(process.argv[2]);
var account = process.argv[3];
var passphrase = process.argv[4];

host.unlockPersonalAccount(account, passphrase, 0, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.dir(data);
});


