
var rskapi = require('..');

exports['get client version'] = async function (test) {
	var provider = createProvider();
	
	provider.web3_clientVersion = function () {
		return 'version 42';
	};
	
	const host = rskapi.host(provider);
	
	const result = await host.getClientVersion();

    test.ok(result);
    test.equal(result, 'version 42');
    test.done();
};

function createProvider() {
	return {
		call: function (method, args, cb) {
			cb(null, this[method].apply(this,args));
		}
	}
}

