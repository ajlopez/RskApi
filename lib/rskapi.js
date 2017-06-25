
function toHex(number) {
	return '0x' + number.toString(16);
}

function Host(provider) {
	this.getBlockNumber = function (cb) {
		provider.call('eth_getBlockNumber', [], cb);
	};
	
	this.getBlockByNumber = function (number, cb) {
		provider.call('eth_getBlock', [toHex(number)], cb);
	};
	
	this.getBlockByHash = function (hash, cb) {
		provider.call('eth_getBlock', [hash], cb);
	};
}

function createHost(options) {
	return new Host(options);
}

module.exports = {
	host: createHost
}