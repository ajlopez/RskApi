
const rskapi = require('..');

exports['get client'] = function (test) {
    const provider = createProvider();
    
    const client = rskapi.client(provider);
    
    test.ok(client);
    test.ok(client.host());
    test.ok(client.host().provider());
    test.strictEqual(client.host().provider(), provider);    
};

function createProvider() {
	return {
		call: function (method, args, cb) {
			cb(null, this[method].apply(this,args));
		}
	}
}
