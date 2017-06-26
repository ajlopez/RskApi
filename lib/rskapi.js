
var sjr = require('simplejsonrpc');

function toHex(number) {
	return '0x' + number.toString(16);
}

function Host(provider) {
	if (typeof provider === 'string')
		provider = sjr.client(provider);
	
	this.getBlockNumber = function (cb) {
		provider.call('eth_blockNumber', [], cb);
	};
	
	this.getBlockByNumber = function (number, txs, cb) {
		if (!cb) {
			cb = txs;
			txs = false;
		}
		
		provider.call('eth_getBlockByNumber', [toHex(number), txs], cb);
	};
	
	this.getBlockByHash = function (hash, txs, cb) {
		if (!cb) {
			cb = txs;
			txs = false;
		}
		
		provider.call('eth_getBlockByHash', [hash, txs], cb);
	};
	
	this.getTransactionByHash = function (hash, cb) {
		provider.call('eth_getTransactionByHash', [hash], cb);
	};
	
	this.getTransactionReceiptByHash = function (hash, cb) {
		provider.call('eth_getTransactionReceipt', [hash], cb);
	};
	
	this.getBalance = function (hash, cb) {
		provider.call('eth_getBalance', [hash], cb);
	};
}

function createHost(options) {
	return new Host(options);
}

module.exports = {
	host: createHost
}
