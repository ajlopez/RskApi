
var rskapi = require('..');

exports['get balance'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_getBalance = function (hash, block) {
		test.equal(block, 'latest');
		return '0x2a'
	};
	
	const host = rskapi.host(provider);
	
	const balance = await host.getBalance('0x1234');

    test.ok(balance);
    test.equal(balance, '0x2a');
    test.done();
};

exports['get code'] = async function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.eth_getCode = function (hash, block) {
		test.equal(block, 'latest');
		return '0x2a';
	};
	
	const host = rskapi.host(provider);
	
    const code = await host.getCode('0x1234');
    
    test.ok(code);
    test.equal(code, '0x2a');
    test.done();
};

exports['get storage at'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_getStorageAt = function (hash, address, block) {
		test.equal(address, '0x2a');
		test.equal(block, 'latest');
		return '0x1234';
	};
	
	const host = rskapi.host(provider);
	
	const storage = await host.getStorageAt('0x1234', 42);
        
    test.ok(storage);
    test.equal(storage, '0x1234');
    
    test.done();
};

exports['get transaction count'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_getTransactionCount = function (hash, block) {
		test.equal(block, 'latest');
		return '0x2a'
	};
	
	const host = rskapi.host(provider);
	
	const count = await host.getTransactionCount('0x1234');
    
    test.ok(count);
    test.equal(count, '0x2a');
    test.done();
};


exports['get transaction count using account hash and block'] = async function (test) {
	var provider = createProvider();
	var expected = 1000;
	expected = '0x' + expected.toString(16);
	
	provider.eth_getTransactionCount = function (hash, block) {
		test.equal(block, expected);
		return '0x2a'
	};
	
	var host = rskapi.host(provider);
	
	const count = await host.getTransactionCount('0x1234', 1000);
    
    test.ok(count);
    test.equal(count, '0x2a');
    test.done();
};

exports['get accounts'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_accounts = function (hash) {
		return [ '0x2a' ];
	};
	
	const host = rskapi.host(provider);
	
    const accounts = await host.getAccounts();

    test.ok(accounts);
    test.ok(Array.isArray(accounts));
    test.equal(accounts.length, 1);
    test.equal(accounts[0], '0x2a');
    test.done();
};

exports['new personal account using passphrase'] = async function (test) {
	var provider = createProvider();
	
	provider.personal_newAccount = function (passphrase) {
		test.equal(passphrase, 'hello');
		return 'world';
	};
	
	const host = rskapi.host(provider);
	
	const result = await host.newPersonalAccount('hello');
    
    test.ok(result);
    test.equal(result, 'world');
    test.done();
};

exports['unlock personal account using passphrase'] = async function (test) {
	var provider = createProvider();
	
	provider.personal_unlockAccount = function (address, passphrase, duration) {
		test.equal(address, 'address');
		test.equal(passphrase, 'hello');
		test.equal(duration, '0xe10');
		return true;
	};
	
	const host = rskapi.host(provider);
	
	const result = await host.unlockPersonalAccount('address', 'hello', 3600);

    test.ok(result);
    test.equal(result, true);
    test.done();
};

exports['lock personal account using passphrase'] = async function (test) {
	var provider = createProvider();
	
	provider.personal_lockAccount = function (address) {
		test.equal(address, 'address');
		return true;
	};
	
	const host = rskapi.host(provider);
	
	const result = await host.lockPersonalAccount('address');
    
    test.ok(result);
    test.equal(result, true);
    test.done();
};

function createProvider() {
	return {
		call: function (method, args, cb) {
			cb(null, this[method].apply(this,args));
		}
	}
}

