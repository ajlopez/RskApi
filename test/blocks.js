
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

exports['get block by number'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getBlock = function (number) {
		return {
			number: number
		}
	};
	
	var host = rskapi.host(provider);
	
	host.getBlockByNumber(42, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(typeof data, 'object');
		
		test.equal(data.number, '0x2a');
		
		test.done();
	});
};

exports['get block by hash'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getBlock = function (hash) {
		return {
			hash: hash
		}
	};
	
	var host = rskapi.host(provider);
	
	host.getBlockByHash('0x1234', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(typeof data, 'object');
		
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

