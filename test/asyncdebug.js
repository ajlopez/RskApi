
var rskapi = require('..');

exports['debug transaction'] = async function (test) {
	var provider = createProvider();
	
	provider.debug_transaction = function (number) {
		return number;
	};
	
	var host = rskapi.host(provider);

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

