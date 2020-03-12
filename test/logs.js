
const rskapi = require('..');

exports['get logs'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getLogs = function (filter) {
        test.ok(filter);
        test.equal(filter.fromBlock, '0x1');
        test.equal(filter.toBlock, '0x2a');
        
        return 'logs';
	};
	
	const host = rskapi.host(provider);
	
	host.getLogs( { fromBlock: 1, toBlock: 42 }, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, 'logs');
		test.done();
	});
};

exports['get logs in account'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getLogs = function (filter) {
        test.ok(filter);
        test.equal(filter.account, '0x0000000000000000000000000000000000000003');
        test.equal(filter.fromBlock, '0x1');
        test.equal(filter.toBlock, '0x2a');
        
        return 'logs';
	};
	
	const host = rskapi.host(provider);
	
	host.getLogs( { account: 3, fromBlock: 1, toBlock: 42 }, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, 'logs');
		test.done();
	});
};

exports['get logs in topic'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getLogs = function (filter) {
        test.ok(filter);
        test.deepEqual(filter.topics, [ '0x0000000000000000000000000000000000000000000000000000000000000003' ]);
        test.equal(filter.fromBlock, '0x1');
        test.equal(filter.toBlock, '0x2a');
        
        return 'logs';
	};
	
	const host = rskapi.host(provider);
	
	host.getLogs( { topics: 3, fromBlock: 1, toBlock: 42 }, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, 'logs');
		test.done();
	});
};

exports['get logs in topics'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getLogs = function (filter) {
        test.ok(filter);
        test.deepEqual(filter.topics, [ '0x0000000000000000000000000000000000000000000000000000000000000003', '0x0000000000000000000000000000000000000000000000000000000000000004' ]);
        test.equal(filter.fromBlock, '0x1');
        test.equal(filter.toBlock, '0x2a');
        
        return 'logs';
	};
	
	const host = rskapi.host(provider);
	
	host.getLogs( { topics: [ 3, 4 ], fromBlock: 1, toBlock: 42 }, function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, 'logs');
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

