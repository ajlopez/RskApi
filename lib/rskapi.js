
var sjr = require('simplejsonrpc');

function toHex(number) {
	return '0x' + number.toString(16);
}

function Host(provider) {
	if (typeof provider === 'string')
		provider = sjr.client(provider);
	
	this.getBlockNumber = function (cb) {
		provider.call('eth_blockNumber', [], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, parseInt(data));
		});
	};
	
	this.getStorageAt = function (hash, address, cb) {
		provider.call('eth_getStorageAt', [hash, toHex(address), 'latest'], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, data);
		});
	};

	this.getBlockByNumber = function (number, txs, cb) {
		if (!cb) {
			cb = txs;
			txs = false;
		}
		
		provider.call('eth_getBlockByNumber', [toHex(number), txs], cb);
	};
	
	this.getBlocksByNumber = function (number, cb) {
		provider.call('eth_getBlocksByNumber', [toHex(number)], cb);
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
	
	this.getAccounts = function (cb) {
		provider.call('eth_accounts', [], cb);
	};
	
	this.getBalance = function (hash, cb) {
		provider.call('eth_getBalance', [hash], cb);
	};
	
	this.getCode = function (hash, cb) {
		provider.call('eth_getCode', [hash, 'latest'], cb);
	};
	
	this.getTransactionCount = function (hash, block, cb) {
		if (!cb) {
			cb = block;
			block = 'latest';
		}
		
		if (typeof block === 'number')
			block = toHex(block);
		
		provider.call('eth_getTransactionCount', [hash, block], cb);
	};

	this.getPeerCount = function (cb) {
		provider.call('net_peerCount', [], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, parseInt(data));
		});
	};

	this.getPeerList = function (cb) {
		provider.call('net_peerList', [], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, data);
		});
	};
	
	this.getGasPrice = function (cb) {
		provider.call('eth_gasPrice', [], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, parseInt(data));
		});
	};	
	
	this.getMining = function (cb) {
		provider.call('eth_mining', [], cb);
	};	
	
	this.getCompilers = function (cb) {
		provider.call('eth_compilers', [], cb);
	};	
	
	this.getClientVersion = function (cb) {
		provider.call('web3_clientVersion', [], cb);
	};	
	
	this.newPersonalAccount = function (passphrase, cb) {
		provider.call('personal_newAccount', [passphrase], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, data);
		});
	};
}

function createHost(options) {
	return new Host(options);
}

module.exports = {
	host: createHost
}
