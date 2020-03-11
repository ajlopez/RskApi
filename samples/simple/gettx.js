
var rskapi = require('../..');

var host = rskapi.host(process.argv[2]);
var hash = process.argv[3];

host.getTransaction(hash, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.dir(data);
});


