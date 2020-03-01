
const rskapi = require('..');
const simpleabi = require('simpleabi');

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
    
	provider.eth_accounts = function () {
		return [];
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.accounts();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
    
    test.done();
};

exports['get balance'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
	provider.eth_getBalance = function (address, block) {
        test.equal(address, '0x0000000000000000000000000000000000000001');
        test.equal(block, 'latest');
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.balance(1);
    
    test.ok(result);
    test.equal(result, '0x2a');
    
    test.done();
};

exports['get nonce'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
	provider.eth_getTransactionCount = function (address, block) {
        test.equal(address, '0x0000000000000000000000000000000000000001');
        test.equal(block, 'latest');
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.nonce(1);
    
    test.ok(result);
    test.equal(result, '0x2a');
    
    test.done();
};

exports['get receipt'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    let ntimes = 0;
    
	provider.eth_getTransactionReceipt = function (hash) {
        if (++ntimes > 2)
            return {};
        
        return null;
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.receipt(1, 0);
    
    test.ok(result);
    test.equal(typeof result, 'object');
    test.equal(ntimes, 3);
    
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
    
    const result = await client.transfer(1, 2, 3);
    
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
    
    const result = await client.transfer(1, 2, 3, { gas: 100000, gasPrice: 1000 });
    
    test.ok(result);
    test.equal(result, '0x2a');
    
    test.done();
};

exports['transfer value using private key'] = async function (test) {
    test.async();
    
    const provider = createProvider();

    let noncecalled = false;
    
    provider.eth_getTransactionCount = function (address) {
        test.equal(address, '0x0000000000000000000000000000000000000001');
        noncecalled = true;
        
        return 12;
    };
    
	provider.eth_sendRawTransaction = function (tx) {
        test.ok(tx);
        test.equal(typeof tx, 'string');
        test.equal(tx.substring(0, 2), '0x');
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.transfer({ address: '0x0000000000000000000000000000000000000001', privateKey: "0xcf449c250f204987e030972c4274fd0947a1721a657923c78fa2f50d41a9dbb7" }, 2, 3, { gas: 100000, gasPrice: 1000 });
    
    test.ok(result);
    test.equal(result, '0x2a');
    test.ok(noncecalled);
    
    test.done();
};

exports['transfer value using private key and nonce in options'] = async function (test) {
    test.async();
    
    const provider = createProvider();

    let noncecalled = false;
    
    provider.eth_getTransactionCount = function (address) {
        test.equal(address, '0x0000000000000000000000000000000000000001');
        noncecalled = true;
        
        return 12;
    };
    
	provider.eth_sendRawTransaction = function (tx) {
        test.ok(tx);
        test.equal(typeof tx, 'string');
        test.equal(tx.substring(0, 2), '0x');
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.transfer({ address: '0x0000000000000000000000000000000000000001', privateKey: "0xcf449c250f204987e030972c4274fd0947a1721a657923c78fa2f50d41a9dbb7" }, 2, 3, { gas: 100000, gasPrice: 1000, nonce: 100 });
    
    test.ok(result);
    test.equal(result, '0x2a');
    test.ok(!noncecalled);
    
    test.done();
};

exports['invoke contract'] = async function (test) {
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
        test.equal(tx.gas, 5000000);
        test.equal(tx.value, 0);
        test.ok(tx.nonce == null);
        test.equal(tx.data, '0x' + simpleabi.encodeCall('symbol()', null));
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.invoke(1, 2, 'symbol()');
    
    test.ok(result);
    test.equal(result, '0x2a');
    
    test.done();
};

exports['invoke contract using options'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
	provider.eth_sendTransaction = function (tx) {
        test.ok(tx);
        
        test.equal(tx.from, '0x0000000000000000000000000000000000000001');
        test.equal(tx.to, '0x0000000000000000000000000000000000000002');
        test.equal(tx.gasPrice, 100);
        test.equal(tx.gas, 1000000);
        test.equal(tx.value, 10);
        test.ok(tx.nonce == null);
        test.equal(tx.data, '0x' + simpleabi.encodeCall('balanceOf(address)', [ 1 ]));
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.invoke(1, 2, 'balanceOf(address)', [ 1 ], { gas: 1000000, value: 10, gasPrice: 100 });
    
    test.ok(result);
    test.equal(result, '0x2a');
    
    test.done();
};

exports['invoke contract using options and private key'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
    let noncecalled = false;
    
    provider.eth_getTransactionCount = function (address) {
        test.equal(address, '0x0000000000000000000000000000000000000001');
        noncecalled = true;
        
        return 12;
    };
    
	provider.eth_sendRawTransaction = function (tx) {
        test.ok(tx);
        test.equal(typeof tx, 'string');
        test.equal(tx.substring(0, 2), '0x');
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.invoke({ address: '0x0000000000000000000000000000000000000001', privateKey: "0xcf449c250f204987e030972c4274fd0947a1721a657923c78fa2f50d41a9dbb7" }, 2, 'balanceOf(address)', [ 1 ], { gas: 1000000, value: 10, gasPrice: 100 });
    
    test.ok(result);
    test.equal(result, '0x2a');
    test.ok(noncecalled);
    
    test.done();
};

exports['invoke contract using options with nonce and private key'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
    let noncecalled = false;
    
    provider.eth_getTransactionCount = function (hash) {
        noncecalled = true;
        return 12;
    };
    
	provider.eth_sendRawTransaction = function (tx) {
        test.ok(tx);
        test.equal(typeof tx, 'string');
        test.equal(tx.substring(0, 2), '0x');
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.invoke({ privateKey: "0xcf449c250f204987e030972c4274fd0947a1721a657923c78fa2f50d41a9dbb7" }, 2, 'balanceOf(address)', [ 1 ], { gas: 1000000, value: 10, gasPrice: 100, nonce: 100 });
    
    test.ok(result);
    test.equal(result, '0x2a');
    test.ok(!noncecalled);
    
    test.done();
};

exports['call contract'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
	provider.eth_call = function (tx) {
        test.ok(tx);
        
        test.equal(tx.from, '0x0000000000000000000000000000000000000001');
        test.equal(tx.to, '0x0000000000000000000000000000000000000002');
        test.equal(tx.gasPrice, 0);
        test.equal(tx.gas, 5000000);
        test.equal(tx.value, 0);
        test.equal(tx.data, '0x' + simpleabi.encodeCall('symbol()', null));
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.call(1, 2, 'symbol()');
    
    test.ok(result);
    test.equal(result, '0x2a');
    
    test.done();
};

exports['call contract using options'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
	provider.eth_call = function (tx) {
        test.ok(tx);
        
        test.equal(tx.from, '0x0000000000000000000000000000000000000001');
        test.equal(tx.to, '0x0000000000000000000000000000000000000002');
        test.equal(tx.gasPrice, 100);
        test.equal(tx.gas, 1000000);
        test.equal(tx.value, 10);
        test.equal(tx.data, '0x' + simpleabi.encodeCall('balanceOf(address)', [ 1 ]));
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.call(1, 2, 'balanceOf(address)', [ 1 ], { gas: 1000000, value: 10, gasPrice: 100 });
    
    test.ok(result);
    test.equal(result, '0x2a');
    
    test.done();
};

exports['call contract using options and address'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
	provider.eth_call = function (tx) {
        test.ok(tx);
        
        test.equal(tx.from, '0x0000000000000000000000000000000000000001');
        test.equal(tx.to, '0x0000000000000000000000000000000000000002');
        test.equal(tx.gasPrice, 100);
        test.equal(tx.gas, 1000000);
        test.equal(tx.value, 10);
        test.ok(tx.nonce == null);
        test.equal(tx.data, '0x' + simpleabi.encodeCall('balanceOf(address)', [ 1 ]));
        
		return '0x2a';
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.call({ address: 1 }, 2, 'balanceOf(address)', [ 1 ], { gas: 1000000, value: 10, gasPrice: 100 });
    
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

