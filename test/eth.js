
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

exports['get mining'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_mining = function () {
		return true;
	};
	
	var host = rskapi.host(provider);
	
	host.getMining(function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.strictEqual(data, true);
		test.done();
	});
};

exports['get compilers'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_compilers = function () {
		return [ "solidity" ];
	};
	
	var host = rskapi.host(provider);
	
	host.getCompilers(function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.deepEqual(data, [ "solidity" ]);
		test.done();
	});
};

exports['get compilers'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getCompilers = function () {
		return [ "solidity" ];
	};
	
	var host = rskapi.host(provider);
	
	host.getCompilers(function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.deepEqual(data, [ "solidity" ]);
		test.done();
	});
};

exports['get syncing info'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_syncing = function () {
		return false;
	};
	
	var host = rskapi.host(provider);
	
	host.getSyncing(function (err, data) {
		test.equal(err, null);
		test.strictEqual(data, false);
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

