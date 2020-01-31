
var sjr = require('simplejsonrpc');

// from https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
);

function toHex(number) {
	if (typeof number === 'string') {
		if (number.length && number.substring(0, 2) !== '0x')
			number = '0x' + number;
		
		return number;
	}
	
	return '0x' + number.toString(16);
}

function toHexBlock(number) {
    if (number === 'latest' || number === 'pending' || number === 'earliest')
        return number;
    
    if (typeof number === 'string' && number.toLowerCase().substring(0, 2) !== '0x')
        number = parseInt(number);
    
    return toHex(number);
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
    const self = this;
    
	if (typeof provider === 'string')
		provider = sjr.client(provider);
	
	this.provider = function () {
		return provider;
	}
	
	this.getBlockNumber = function (cb) {
        if (!cb)
            return promisify(cb => self.getBlockNumber(cb));
        
		provider.call('eth_blockNumber', [], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, parseInt(data));
		});
	};
	
	this.getStorageAt = function (hash, address, cb) {
        if (!cb)
            return promisify(cb => self.getStorageAt(hash, address, cb));
        
		provider.call('eth_getStorageAt', [hash, toHex(address), 'latest'], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, data);
		});
	};

	this.getBlockByNumber = function (number, txs, cb) {
		if (!cb && typeof txs === 'function') {
			cb = txs;
			txs = false;
		}
        
        if (!cb)
            return promisify(cb => self.getBlockByNumber(number, txs || false, cb));
		
		provider.call('eth_getBlockByNumber', [toHexBlock(number), txs], cb);
	};
	
	this.getBlocksByNumber = function (number, cb) {
        if (!cb)
            return promisify(cb => self.getBlocksByNumber(number, cb));
        
		provider.call('eth_getBlocksByNumber', [toHexBlock(number)], cb);
	};
	
	this.getBlockByHash = function (hash, txs, cb) {
		if (!cb && typeof txs === 'function') {
			cb = txs;
			txs = false;
		}
        
        if (!cb)
            return promisify(cb => self.getBlockByHash(hash, txs || false, cb));
		
		provider.call('eth_getBlockByHash', [hash, txs], cb);
	};
	
	this.getTransactionByHash = function (hash, cb) {
        if (!cb)
            return promisify(cb => self.getTransactionByHash(hash, cb));
        
		provider.call('eth_getTransactionByHash', [hash], cb);
	};
	
	this.getTransactionReceiptByHash = function (hash, cb) {
        if (!cb)
            return promisify(cb => self.getTransactionReceiptByHash(hash, cb));
        
		provider.call('eth_getTransactionReceipt', [hash], cb);
	};
	
	this.getAccounts = function (cb) {
        if (!cb)
            return promisify(cb => self.getAccounts(cb));
        
		provider.call('eth_accounts', [], cb);
	};
	
	this.getBalance = function (hash, cb) {
        if (!cb)
            return promisify(cb => self.getBalance(hash, cb));
        
		provider.call('eth_getBalance', [hash, 'latest'], cb);
	};
	
	this.getCode = function (hash, cb) {
        if (!cb)
            return promisify(cb => self.getCode(hash, cb));
        
		provider.call('eth_getCode', [hash, 'latest'], cb);
	};
	
	this.getTransactionCount = function (hash, block, cb) {
		if (!cb && typeof block === 'function') {
			cb = block;
			block = 'latest';
		}
        
        if (!cb)
            return promisify(cb => self.getTransactionCount(hash, block || "latest", cb));
		
		if (typeof block === 'number')
			block = toHex(block);
		
		provider.call('eth_getTransactionCount', [hash, block], cb);
	};

	this.getPeerCount = function (cb) {
        if (!cb)
            return promisify(cb => self.getPeerCount(cb));
        
		provider.call('net_peerCount', [], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, parseInt(data));
		});
	};

	this.getPeerList = function (cb) {
        if (!cb)
            return promisify(cb => self.getPeerList(cb));
        
		provider.call('net_peerList', [], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, data);
		});
	};
	
	this.getScoringPeerList = function (cb) {
        if (!cb)
            return promisify(cb => self.getScoringPeerList(cb));
        
		provider.call('sco_peerList', [], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, data);
		});
	};
	
	this.getGasPrice = function (cb) {
        if (!cb)
            return promisify(cb => self.getGasPrice(cb));
        
		provider.call('eth_gasPrice', [], function (err, data) {
			if (err)
				cb(err, null);
			else
				cb(null, parseInt(data));
		});
	};	
	
	this.getMining = function (cb) {
        if (!cb)
            return promisify(cb => self.getMining(cb));
        
		provider.call('eth_mining', [], cb);
	};	
	
	this.getCompilers = function (cb) {
        if (!cb)
            return promisify(cb => self.getCompilers(cb));
        
		provider.call('eth_getCompilers', [], cb);
	};	
	
	this.getSyncing = function (cb) {
        if (!cb)
            return promisify(cb => self.getSyncing(cb));
        
		provider.call('eth_syncing', [], cb);
	};	
	
	this.getClientVersion = function (cb) {
        if (!cb)
            return promisify(cb => self.getClientVersion(cb));
        
		provider.call('web3_clientVersion', [], cb);
	};	
	
	this.newPersonalAccount = function (passphrase, cb) {
        if (!cb)
            return promisify(cb => self.newPersonalAccount(passphrase, cb));
        
		provider.call('personal_newAccount', [passphrase], cb);
	};
	
	this.unlockPersonalAccount = function (address, passphrase, duration, cb) {
        if (!cb)
            return promisify(cb => self.unlockPersonalAccount(address, passphrase, duration, cb));
        
		provider.call('personal_unlockAccount', [address, passphrase, toHex(duration)], cb);
	};
	
	this.lockPersonalAccount = function (address, cb) {
        if (!cb)
            return promisify(cb => self.lockPersonalAccount(address, cb));
        
		provider.call('personal_lockAccount', [address], cb);
	};
	
	this.sendTransaction = function (data, cb) {
        if (!cb)
            return promisify(cb => self.sendTransaction(data, cb));
        
		provider.call('eth_sendTransaction', [normalizeTransactionData(data)], cb);
	}
	
	this.sendRawTransaction = function (data, cb) {
        if (!cb)
            return promisify(cb => self.sendRawTransaction(data, cb));
        
        provider.call('eth_sendRawTransaction', [toHex(data)], cb);
	}
	
	this.callTransaction = function (data, cb) {
        if (!cb)
            return promisify(cb => self.callTransaction(data, cb));
        
		provider.call('eth_call', [normalizeTransactionData(data), 'latest'], cb);
	}
    
	this.traceBlock = function (data, cb) {
        if (!cb)
            return promisify(cb => self.traceBlock(data, cb));

		provider.call('trace_block', [toHex(data)], cb);
	}
    
	this.traceTransaction = function (data, cb) {
        if (!cb)
            return promisify(cb => self.traceTransaction(data, cb));

		provider.call('trace_transaction', [toHex(data)], cb);
	}
    
	this.debugTransaction = function (data, cb) {
        if (!cb)
            return promisify(cb => self.debugTransaction(data, cb));

		provider.call('debug_transaction', [toHex(data)], cb);
	}
}

function createHost(options) {
	return new Host(options);
}

module.exports = {
	host: createHost
}
