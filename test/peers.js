
var rskapi = require('..');

exports['get peers count'] = function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.net_peerCount = function (hash) {
		return '0x2a'
	};
	
	var host = rskapi.host(provider);
	
	host.getPeerCount(function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, 42);
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

