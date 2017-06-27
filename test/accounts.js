
var rskapi = require('..');

exports['get balance'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getBalance = function (hash) {
		return '0x2a'
	};
	
	var host = rskapi.host(provider);
	
	host.getBalance('0x1234', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, '0x2a');
		test.done();
	});
};

exports['get transaction count'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getTransactionCount = function (hash, block) {
		test.equal(block, 'latest');
		return '0x2a'
	};
	
	var host = rskapi.host(provider);
	
	host.getTransactionCount('0x1234', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, '0x2a');
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

