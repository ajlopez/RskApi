
var rskapi = require('../..');

var host = rskapi.host(process.argv[2]);

host.getGasPrice(function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.log(data);
});


