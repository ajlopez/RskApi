
var rskapi = require('..');

exports['trace block'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.trace_block = function (number) {
		return number;
	};
	
	const host = rskapi.host(provider);
	
	host.traceBlock(42, function (err, data) {
		test.equal(err, null);
		test.strictEqual(data, '0x2a');
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

