
var rskapi = require('../..');

var host = rskapi.host(process.argv[2]);
var hash = process.argv[3];

host.debugTransaction(hash, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.log(JSON.stringify(data, null, 4));
});


