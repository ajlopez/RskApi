
const rskapi = require('..');

const methods = {
	eth_blockNumber: function () {
		return 42;
	}
};

let server;

exports['start http server'] = function (test) {
	test.async();
	
	server = createServer(methods);
	
	server.listen(3000, function (err) {
		if (err)
			console.log(err);
		else
			test.done();
	});
};
	
exports['get block number'] = function (test) {
	const host = rskapi.host('http://localhost:3000');
	
	test.async();
	
	host.getBlockNumber(function (err, data) {
		test.equal(err, null);
		test.equal(data, 42);
		test.done();
	});
};

exports['stop http server'] = function (test) {
	test.async();
	
	server.close(function (err) {
		if (err)
			console.log(err);
		else
			test.done();
	});
};

function createServer(methods) {
	return require('http').createServer(function (req, res) {		
		if (req.method === 'POST') {
			let body = '';

			req.on('data', function (data) {
				body += data;
			});

			req.on('end', function () {
				const input = JSON.parse(body);
				
				const data = {
					id: input.id,
					jsonrpc: input.data
				};
				
				if (!methods[input.method])
					data.error = { code: -32061, message: 'Method not found' };
				else
					data.result = methods[input.method].apply(methods, input.params);
				
				res.write(JSON.stringify(data));
				
				res.end();
			});
		}
	});	
}
