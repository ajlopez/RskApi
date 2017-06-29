
var rskapi = require('..');

exports['get block number'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_blockNumber = function () {
		return '0x2a';
	};
	
	var host = rskapi.host(provider);
	
	host.getBlockNumber(function (err, data) {
		test.equal(err, null);
		test.equal(typeof data, 'number');
		test.equal(data, 42);
		test.done();
	});
};

exports['get block by number'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockByNumber = function (number) {
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

exports['get blocks by number'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getBlocksByNumber = function (number) {
		return [
			{
				number: number
			}
		];
	};
	
	var host = rskapi.host(provider);
	
	host.getBlocksByNumber(42, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.ok(Array.isArray(data));
		
		test.done();
	});
};

exports['get block by hash'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockByHash = function (hash) {
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

