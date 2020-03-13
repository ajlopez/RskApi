
const rskapi = require('../..');

const host = rskapi.host(process.argv[2]);

const from = process.argv[3];
const to = process.argv[4];
const value = process.argv[5];

const txdata = {
	from: from,
	to: to,
	value: value,
	gas: 21000,
	nonce: 0x10,
	gasPrice: 1
}


host.sendTransaction(txdata, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.dir(data);
});


