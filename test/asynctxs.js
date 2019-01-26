
var rskapi = require('..');

exports['get transaction by hash'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_getTransactionByHash = function (hash) {
		return {
			hash: hash
		};
	};
	
	const host = rskapi.host(provider);
	
	const tx = await host.getTransactionByHash('0x1234');
    
    test.ok(tx);
    test.equal(tx.hash, '0x1234');
    test.done();
};

exports['get transaction receipt by hash'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_getTransactionReceipt = function (hash) {
		return {
			hash: hash
		};
	};
	
	const host = rskapi.host(provider);
	
	const txr = await host.getTransactionReceiptByHash('0x1234');
    
    test.ok(txr);
    test.equal(txr.hash, '0x1234');
    test.done();
};

exports['send transaction'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_sendTransaction = function (data) {
		return data;
	};
	
	const host = rskapi.host(provider);
	
	const txdata = {
		from: '0x01',
		to: '0x02',
		gasPrice: 1,
		gas: 21000,
		value: 10000
	}
	
	const result = await host.sendTransaction(txdata);

    test.ok(result);
    test.deepEqual(result, txdata);
    test.done();
};

exports['call transaction'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_call = function (data) {
		return data;
	};
	
	const host = rskapi.host(provider);
	
	const txdata = {
		from: '0x01',
		to: '0x02',
		gasPrice: 1,
		gas: 21000,
		value: 10000
	}
	
    const result = await host.callTransaction(txdata);
    
    test.ok(result);
    test.deepEqual(result, txdata);
    test.done();
};

exports['send raw transaction'] = async function (test) {
	var provider = createProvider();
	
	provider.eth_sendRawTransaction = function (data) {
		return data;
	};
	
	const host = rskapi.host(provider);
	
	const txdata = '010203';
	
	const result = await host.sendRawTransaction(txdata);

    test.ok(result);
    test.equal(result, '0x010203');
    test.done();
};

function createProvider() {
	return {
		call: function (method, args, cb) {
			cb(null, this[method].apply(this,args));
		}
	}
}

