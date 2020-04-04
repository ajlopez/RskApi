
const rskapi = require('..');

exports['get block number'] = async function (test) {
	const provider = createProvider();
	
	provider.eth_blockNumber = function () {
		return '0x2a';
	};
	
	const host = rskapi.host(provider);
	
	const number = await host.getBlockNumber();
    
    test.equal(typeof number, 'number');
    test.equal(number, 42);
    test.done();
};

exports['get block by number'] = async function (test) {
	const provider = createProvider();
	
	provider.eth_getBlockByNumber = function (number) {
		return {
			number: number
		}
	};
	
	const host = rskapi.host(provider);
	
	const block = await host.getBlockByNumber(42);
    
    test.ok(block);
    test.equal(typeof block, 'object');
    
    test.equal(block.number, '0x2a');
    
    test.done();
};

exports['get blocks by number'] = async function (test) {
	const provider = createProvider();
	
	provider.eth_getBlocksByNumber = function (number) {
		return [
			{
				number: number
			}
		];
	};
	
	const host = rskapi.host(provider);
	
	const blocks = await host.getBlocksByNumber(42);

    test.ok(blocks);
    test.ok(Array.isArray(blocks));
    test.deepEqual(blocks, [ { number: 42 } ]);
    
    test.done();
};

exports['get block by hash'] = async function (test) {
	const provider = createProvider();
	
	provider.eth_getBlockByHash = function (hash) {
		return {
			hash: hash
		}
	};
	
	const host = rskapi.host(provider);
	
	const block = await host.getBlockByHash('0x1234');

    test.ok(block);
    test.equal(typeof block, 'object');
    
    test.equal(block.hash, '0x0000000000000000000000000000000000000000000000000000000000001234');
		
    test.done();
};

function createProvider() {
	return {
		call: function (method, args, cb) {
			cb(null, this[method].apply(this,args));
		}
	}
}

