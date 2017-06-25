
var rskapi = require('..');

exports['get block number'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockNumber = function () {
		return 42;
	};
	
	var host = rskapi.host(provider);
	
	host.getBlockNumber(function (err, data) {
		test.equal(err, null);
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

