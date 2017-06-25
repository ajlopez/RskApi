
var rskapi = require('..');

exports['get transaction by hash'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getTransactionByHash = function (hash) {
		return {
			hash: hash
		};
	};
	
	var host = rskapi.host(provider);
	
	host.getTransactionByHash('0x1234', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data.hash, '0x1234');
		test.done();
	});
};

exports['get transaction receipt by hash'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getTransactionReceipt = function (hash) {
		return {
			hash: hash
		};
	};
	
	var host = rskapi.host(provider);
	
	host.getTransactionReceiptByHash('0x1234', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data.hash, '0x1234');
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

