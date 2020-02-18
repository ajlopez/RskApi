
const rskapi = require('..');

exports['debug transaction'] = async function (test) {
	const provider = createProvider();
	
	provider.debug_traceTransaction = function (number) {
		return number;
	};
	
	const host = rskapi.host(provider);

	const result = await host.debugTransaction(42);
	
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

