
var rskapi = require('../..');

var host = rskapi.host(process.argv[2]);

host.getBlockNumber(function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.log(parseInt(data, 16));
});


