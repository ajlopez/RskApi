
var rskapi = require('..');

exports['get balance'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getBalance = function (hash, block) {
		test.equal(block, 'latest');
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

exports['get code'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getCode = function (hash, block) {
		test.equal(block, 'latest');
		return '0x2a';
	};
	
	var host = rskapi.host(provider);
	
	host.getCode('0x1234', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, '0x2a');
		test.done();
	});
};

exports['get storage at'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getStorageAt = function (hash, address, block) {
		test.equal(address, '0x2a');
		test.equal(block, 'latest');
		return '0x1234';
	};
	
	var host = rskapi.host(provider);
	
	host.getStorageAt('0x1234', 42, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, '0x1234');
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


exports['get transaction count using account hash and block'] = function (test) {
	var provider = createProvider();
	var expected = 1000;
	expected = '0x' + expected.toString(16);
	
	test.async();
	
	provider.eth_getTransactionCount = function (hash, block) {
		test.equal(block, expected);
		return '0x2a'
	};
	
	var host = rskapi.host(provider);
	
	host.getTransactionCount('0x1234', 1000, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, '0x2a');
		test.done();
	});
};

exports['get accounts'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_accounts = function (hash) {
		return [ '0x2a' ];
	};
	
	var host = rskapi.host(provider);
	
	host.getAccounts(function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.ok(Array.isArray(data));
		test.equal(data.length, 1);
		test.equal(data[0], '0x2a');
		test.done();
	});
};

exports['new personal account using passphrase'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.personal_newAccount = function (passphrase) {
		test.equal(passphrase, 'hello');
		return 'world';
	};
	
	var host = rskapi.host(provider);
	
	host.newPersonalAccount('hello', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, 'world');
		test.done();
	});
};

exports['unlock personal account using passphrase'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.personal_unlockAccount = function (address, passphrase, duration) {
		test.equal(address, 'address');
		test.equal(passphrase, 'hello');
		test.equal(duration, '0xe10');
		return true;
	};
	
	var host = rskapi.host(provider);
	
	host.unlockPersonalAccount('address', 'hello', 3600, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, true);
		test.done();
	});
};

exports['lock personal account using passphrase'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.personal_lockAccount = function (address) {
		test.equal(address, 'address');
		return true;
	};
	
	var host = rskapi.host(provider);
	
	host.lockPersonalAccount('address', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, true);
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

