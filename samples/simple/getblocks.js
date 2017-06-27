
var rskapi = require('../..');

var host = rskapi.host(process.argv[2]);
var number = parseInt(process.argv[3]);

host.getBlocksByNumber(number, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.dir(data);
});


