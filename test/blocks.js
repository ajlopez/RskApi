
const rskapi = require('..');

exports['get block number'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_blockNumber = function () {
		return '0x2a';
	};
	
	const host = rskapi.host(provider);
	
	host.getBlockNumber(function (err, data) {
		test.equal(err, null);
		test.equal(typeof data, 'number');
		test.equal(data, 42);
		test.done();
	});
};

exports['get block by number'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockByNumber = function (number, txs) {
        test.strictEqual(txs, false);
        
		return {
			number: number
		}
	};
	
	const host = rskapi.host(provider);
	
	host.getBlockByNumber(42, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(typeof data, 'object');
		
		test.equal(data.number, '0x2a');
		
		test.done();
	});
};

exports['get block by number with full transactions'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockByNumber = function (number, txs) {
        test.strictEqual(txs, true);
        
		return {
			number: number
		}
	};
	
	const host = rskapi.host(provider);
	
	host.getBlockByNumber(42, true, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(typeof data, 'object');
		
		test.equal(data.number, '0x2a');
		
		test.done();
	});
};

exports['get block by number using decimal string'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockByNumber = function (number) {
		return {
			number: number
		}
	};
	
	const host = rskapi.host(provider);
	
	host.getBlockByNumber('42', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(typeof data, 'object');
		
		test.equal(data.number, '0x2a');
		
		test.done();
	});
};

exports['get block by number using hexadecimal'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockByNumber = function (number) {
		return {
			number: number
		}
	};
	
	const host = rskapi.host(provider);
	
	host.getBlockByNumber('0x2a', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(typeof data, 'object');
		
		test.equal(data.number, '0x2a');
		
		test.done();
	});
};

exports['get latest block'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockByNumber = function (number) {
		return {
			number: number
		}
	};
	
	const host = rskapi.host(provider);
	
	host.getBlockByNumber('latest', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(typeof data, 'object');
		
		test.equal(data.number, 'latest');
		
		test.done();
	});
};

exports['get pending block'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockByNumber = function (number) {
		return {
			number: number
		}
	};
	
	const host = rskapi.host(provider);
	
	host.getBlockByNumber('pending', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(typeof data, 'object');
		
		test.equal(data.number, 'pending');
		
		test.done();
	});
};

exports['get earliest block'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockByNumber = function (number) {
		return {
			number: number
		}
	};
	
	const host = rskapi.host(provider);
	
	host.getBlockByNumber('earliest', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(typeof data, 'object');
		
		test.equal(data.number, 'earliest');
		
		test.done();
	});
};

exports['get blocks by number'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getBlocksByNumber = function (number) {
		return [
			{
				number: number
			}
		];
	};
	
	const host = rskapi.host(provider);
	
	host.getBlocksByNumber(42, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.ok(Array.isArray(data));
		
		test.done();
	});
};

exports['get block by hash'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockByHash = function (hash, txs) {
        test.strictEqual(txs, false);
        
		return {
			hash: hash
		}
	};
	
	const host = rskapi.host(provider);
	
	host.getBlockByHash('0x1234', function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(typeof data, 'object');
		
		test.equal(data.hash, '0x0000000000000000000000000000000000000000000000000000000000001234');
		
		test.done();
	});
};

exports['get block by hash with full transactions'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getBlockByHash = function (hash, txs) {
        test.strictEqual(txs, true);
        
		return {
			hash: hash
		}
	};
	
	const host = rskapi.host(provider);
	
	host.getBlockByHash('0x1234', true, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(typeof data, 'object');
		
		test.equal(data.hash, '0x0000000000000000000000000000000000000000000000000000000000001234');
		
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

