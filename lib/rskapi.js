
function Host(provider) {
	this.getBlockNumber = function (cb) {
		provider.call('eth_getBlockNumber', [], cb);
	}
}

function createHost(options) {
	return new Host(options);
}

module.exports = {
	host: createHost
}