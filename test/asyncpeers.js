
var rskapi = require('..');

exports['get peers count'] = async function (test) {
	var provider = createProvider();
	
	provider.net_peerCount = function (hash) {
		return '0x2a'
	};
	
	const host = rskapi.host(provider);
	
	const count = await host.getPeerCount();
    
    test.ok(count);
    test.equal(count, 42);
    test.done();
};

exports['get peer list'] = async function (test) {
	var provider = createProvider();
	
	provider.net_peerList = function (hash) {
		return [];
	};
	
	const host = rskapi.host(provider);
	
	const list = await host.getPeerList();
    
    test.ok(list);
    test.ok(Array.isArray(list));
    test.equal(list.length, 0);
    test.done();
};

exports['get scoring peer list'] = async function (test) {
	var provider = createProvider();
	
	test.async();
	
	provider.sco_peerList = function (hash) {
		return [];
	};
	
	var host = rskapi.host(provider);
	
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

