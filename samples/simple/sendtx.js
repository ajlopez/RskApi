
var rskapi = require('../..');

var host = rskapi.host(process.argv[2]);

var from = process.argv[3];
var to = process.argv[4];
var value = process.argv[5];

var txdata = {
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


