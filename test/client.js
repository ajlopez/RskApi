
const rskapi = require('..');

exports['get client'] = function (test) {
    const provider = createProvider();
    
    const client = rskapi.client(provider);
    
    test.ok(client);
    test.ok(client.host());
    test.ok(client.host().provider());
    test.strictEqual(client.host().provider(), provider);    
};

exports['get accounts'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
	provider.eth_accounts = function (hash) {
		return [];
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.accounts();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
    
    test.done();
};

exports['transfer value'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
    provider.eth_gasPrice = function () {
        return '0x2a';
    };
    
	provider.eth_sendTransaction = function (tx) {
        test.ok(tx);
        
        test.equal(tx.from, '0x0000000000000000000000000000000000000001');
        test.equal(tx.to, '0x0000000000000000000000000000000000000002');
        test.equal(tx.gasPrice, 42);
        test.equal(tx.gas, 21000);
        test.equal(tx.value, 3);
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.xtransfer(1, 2, 3);
    
    test.ok(result);
    test.equal(result, '0x2a');
    
    test.done();
};

exports['transfer value using options'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
	provider.eth_sendTransaction = function (tx) {
        test.ok(tx);
        
        test.equal(tx.from, '0x0000000000000000000000000000000000000001');
        test.equal(tx.to, '0x0000000000000000000000000000000000000002');
        test.equal(tx.gasPrice, 1000);
        test.equal(tx.gas, 100000);
        test.equal(tx.value, 3);
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.xtransfer(1, 2, 3, { gas: 100000, gasPrice: 1000 });
    
    test.ok(result);
    test.equal(result, '0x2a');
    
    test.done();
};

function createProvider() {
	return {
		call: function (method, args, cb) {
			cb(null, this[method].apply(this,args));
		}
	}
}
