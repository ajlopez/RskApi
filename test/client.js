
const rskapi = require('..');

exports['get client'] = function (test) {
    const provider = createProvider();
    
    const client = rskapi.client(provider);
    
    test.ok(client);
    test.ok(client.host());
    test.ok(client.host().provider());
    test.strictEqual(client.host().provider(), provider);    
};

exports['get accounts'] = async function (test) {
    test.async();
    
    const provider = createProvider();
    
	provider.eth_accounts = function (hash) {
		return [];
	};
    
    const client = rskapi.client(provider);
    
    const result = await client.accounts();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.equal(result.length, 0);
    
    test.done();
};

function createProvider() {
	return {
		call: function (method, args, cb) {
			cb(null, this[method].apply(this,args));
		}
	}
}
