
var rskapi = require('..');

exports['get gas price'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_gasPrice = function () {
		return '0x2a';
	};
	
	const host = rskapi.host(provider);
	
	const price = await host.getGasPrice();

    test.ok(price);
    test.equal(price, 42);
    test.done();
};

exports['get mining'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_mining = function () {
		return true;
	};
	
	const host = rskapi.host(provider);
	
	const result = await host.getMining();
    
    test.ok(result);
    test.strictEqual(result, true);
    test.done();
};

exports['get compilers'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_getCompilers = function () {
		return [ "solidity" ];
	};
	
	const host = rskapi.host(provider);
	
	const compilers = await host.getCompilers();
    
    test.ok(compilers);
    test.deepEqual(compilers, [ "solidity" ]);
    test.done();
};

exports['get syncing info'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_syncing = function () {
		return false;
	};
	
	const host = rskapi.host(provider);
	
	const result = await host.getSyncing();
    
    test.strictEqual(result, false);
    test.done();
};

function createProvider() {
	return {
		call: function (method, args, cb) {
			cb(null, this[method].apply(this,args));
		}
	}
}

