
const rskapi = require('..');

exports['get peers count'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.net_peerCount = function (hash) {
		return '0x2a'
	};
	
	const host = rskapi.host(provider);
	
	host.getPeerCount(function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.equal(data, 42);
		test.done();
	});
};

exports['get peer list'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.net_peerList = function (hash) {
		return [];
	};
	
	const host = rskapi.host(provider);
	
	host.getPeerList(function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.ok(Array.isArray(data));
		test.equal(data.length, 0);
		test.done();
	});
};

exports['get scoring peer list'] = function (test) {
	const provider = createProvider();
	
	test.async();
	
	provider.sco_peerList = function (hash) {
		return [];
	};
	
	const host = rskapi.host(provider);
	
	host.getScoringPeerList(function (err, data) {
		test.equal(err, null);
		test.ok(data);
		test.ok(Array.isArray(data));
		test.equal(data.length, 0);
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

