
const rskapi = require('..');

exports['get logs'] = async function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.eth_getLogs = function (filter) {
        test.ok(filter);
        test.equal(filter.fromBlock, '0x1');
        test.equal(filter.toBlock, '0x2a');
        
        return 'logs';
	};
	
	const host = rskapi.host(provider);
	
	const result = await host.getLogs( { fromBlock: 1, toBlock: 42 });

    test.ok(result);
    test.equal(result, 'logs');
    test.done();
};

exports['get logs with account'] = async function (test) {
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
	
	const result = await host.getLogs( { account: 3, fromBlock: 1, toBlock: 42 });

    test.ok(result);
    test.equal(result, 'logs');
    test.done();
};

function createProvider() {
	return {
		call: function (method, args, cb) {
			cb(null, this[method].apply(this,args));
		}
	}
}

