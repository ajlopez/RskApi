
var rskapi = require('..');

exports['get gas price'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_gasPrice = function () {
		return '0x2a';
	};
	
	var host = rskapi.host(provider);
	
	host.getGasPrice(function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, 42);
		test.done();
	});
};

function createProvider() {
	return {
		call: function (method, args, cb) {
			cb(null, this[method].apply(this,args));
		}
	}
}

