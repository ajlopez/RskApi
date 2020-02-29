
const sjr = require('simplejsonrpc');
const Tx = require('ethereumjs-tx');
const simpleabi = require('simpleabi');

// from https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
);

const addressZeroes = String('0').repeat(20 * 2);

function toAddress(value) {
    if (typeof value !== 'string')
        value = value.toString(16);
    
    if (value.substring(0, 2) === '0x')
        if (value.length === 20 * 2 + 2)
            return value;
        else
            value = value.subtring(2);
        
    if (value.length > 20 * 2)
        value = value.substring(value.length - 20 * 2);
    else
        value = addressZeroes.substring(0, addressZeroes.length - value.length) + value;
    
    return '0x' + value;
}

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
        
		provider.call('eth_getTransactionByHash', [toHex(hash)], cb);
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

		provider.call('trace_block', [toHexBlock(data)], cb);
	}
    
	this.traceTransaction = function (data, cb) {
        if (!cb)
            return promisify(cb => self.traceTransaction(data, cb));

		provider.call('trace_transaction', [toHex(data)], cb);
	}
    
	this.debugTransaction = function (data, cb) {
        if (!cb)
            return promisify(cb => self.debugTransaction(data, cb));

		provider.call('debug_traceTransaction', [toHex(data)], cb);
	}
    
    this.getLogs = function (filter, cb) {
        if (!cb)
            return promisify(cb => self.getLogs(filter, cb));
        
        if (filter.fromBlock)
            filter.fromBlock = toHexBlock(filter.fromBlock);
        if (filter.toBlock)
            filter.toBlock = toHexBlock(filter.toBlock);
        
        provider.call('eth_getLogs', [ filter ], cb);
    }
}

function Client(options) {
    const self = this;
    const host = new Host(options);
    
    this.host = function () { return host; };
    
    this.accounts = function (cb) {
        if (!cb)
            return promisify(cb => self.accounts(cb));
        
        host.getAccounts(cb);
    };
    
    this.xtransfer = function (from, to, value, options, cb) {
        if (!cb)
            return promisify(cb => self.xtransfer(from, to, value, options, cb));
        
        options = options || {};
        
        if (options.gasPrice)
            sendTransaction(null, options.gasPrice);
        else
            host.getGasPrice(sendTransaction);
        
        function sendTransaction(err, data) {
            if (err)
                return cb(err, data);
            
            const tx = {
                from: toAddress(from),
                to: toAddress(to),
                value: value,
                gasPrice: data,
                gas: options.gas || 21000
            };
            
            if (typeof from === 'object') {
                const xtx = new Tx(tx);
                const privateKey = Buffer.from(from.privateKey.substring(2), 'hex');
                xtx.sign(privateKey);

                const serializedTx = xtx.serialize();
                
                host.sendRawTransaction('0x' + serializedTx, cb);
            }
            else {
                tx.from = toAddress(from);
                host.sendTransaction(tx, cb);            
            }            
        }
    };
    
    this.xinvoke = function (from, to, fn, args, options, cb) {
        if (!cb)
            return promisify(cb => self.xinvoke(from, to, fn, args, options, cb));
        
        options = options || {};
        
        if (options.gasPrice)
            sendTransaction(null, options.gasPrice);
        else
            host.getGasPrice(sendTransaction);
        
        function sendTransaction(err, data) {
            if (err)
                return cb(err, data);
            
            const tx = {
                from: toAddress(from),
                to: toAddress(to),
                value: options.value || 0,
                gasPrice: data,
                gas: options.gas || 5000000,
                data: '0x' + simpleabi.encodeCall(fn, args)
            };
            
            if (typeof from === 'object') {
                const xtx = new Tx(tx);
                const privateKey = Buffer.from(from.privateKey.substring(2), 'hex');
                xtx.sign(privateKey);

                const serializedTx = xtx.serialize();
                
                host.sendRawTransaction('0x' + serializedTx, cb);
            }
            else {
                tx.from = toAddress(from);
                host.sendTransaction(tx, cb);            
            }            
        }
    };
}

function createHost(options) {
	return new Host(options);
}

function createClient(options) {
    return new Client(options);
}

module.exports = {
	host: createHost,
    client: createClient
}
