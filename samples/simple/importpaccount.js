
const rskapi = require('../..');

const host = rskapi.host(process.argv[2]);
const privateKey = process.argv[3];
const passphrase = process.argv[4];

host.importPersonalRawKey(privateKey, passphrase, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.log(data);
});


