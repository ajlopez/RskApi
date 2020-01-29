
var rskapi = require('..');

exports['trace block'] = async function (test) {
	var provider = createProvider();
	
	provider.trace_block = function (number) {
		return number;
	};
	
	var host = rskapi.host(provider);

	const result = await host.traceBlock(42);
	
    test.strictEqual(result, '0x2a');
    test.done();
};

exports['trace transaction'] = async function (test) {
	var provider = createProvider();
	
	provider.trace_transaction = function (number) {
		return number;
	};
	
	var host = rskapi.host(provider);

	const result = await host.traceTransaction(42);
	
    test.strictEqual(result, '0x2a');
    test.done();
};

function createProvider() {
	return {
		call: function (method, args, cb) {
			cb(null, this[method].apply(this,args));
		}
	}
}

