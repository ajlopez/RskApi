
var sjr = require('simplejsonrpc');

function toHex(number) {
	if (typeof number === 'string') {
		if (number.length && number.substring(0, 2) !== '0x')
			number = '0x' + number;
		
		return number;
	}
	
	return '0x' + number.toString(16);
}

function normalizeTransactionData(txdata) {
	if (txdata.from != null)
		txdata.from = toHex(txdata.from);
	
	if (txdata.to != null)
		txdata.to = toHex(txdata.to);

	if (txdata.value != null)
		txdata.value = toHex(txdata.value);

	if (txdata.data != null)
		txdata.data = toHex(txdata.data);

	if (txdata.gas != null)
		txdata.gas = toHex(txdata.gas);

	if (txdata.gasPrice != null)
		txdata.gasPrice = toHex(txdata.gasPrice);
	
	return txdata;
}

function Host(provider) {
	if (typeof provider === 'string')
		provider = sjr.client(provider);
	
	this.provider = function () {
		return provider;
	}
	
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
		provider.call('eth_getBalance', [hash, 'latest'], cb);
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
	
	this.getScoringPeerList = function (cb) {
		provider.call('sco_peerList', [], function (err, data) {
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
		provider.call('eth_getCompilers', [], cb);
	};	
	
	this.getSyncing = function (cb) {
		provider.call('eth_syncing', [], cb);
	};	
	
	this.getClientVersion = function (cb) {
		provider.call('web3_clientVersion', [], cb);
	};	
	
	this.newPersonalAccount = function (passphrase, cb) {
		provider.call('personal_newAccount', [passphrase], cb);
	};
	
	this.unlockPersonalAccount = function (address, passphrase, duration, cb) {
		provider.call('personal_unlockAccount', [address, passphrase, toHex(duration)], cb);
	};
	
	this.lockPersonalAccount = function (address, cb) {
		provider.call('personal_lockAccount', [address], cb);
	};
	
	this.sendTransaction = function (data, cb) {
		provider.call('eth_sendTransaction', [normalizeTransactionData(data)], cb);
	}
	
	this.sendRawTransaction = function (data, cb) {
        provider.call('eth_sendRawTransaction', [toHex(data)], cb);
	}
	
	this.callTransaction = function (data, cb) {
		provider.call('eth_call', [normalizeTransactionData(data), 'latest'], cb);
	}
}

function createHost(options) {
	return new Host(options);
}

module.exports = {
	host: createHost
}
