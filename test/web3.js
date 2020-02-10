
const rskapi = require('..');

exports['get client version'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.web3_clientVersion = function () {
		return 'version 42';
	};
	
	const host = rskapi.host(provider);
	
	host.getClientVersion(function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, 'version 42');
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

