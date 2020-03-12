
const sjr = require('simplejsonrpc');
const Tx = require('ethereumjs-tx');
const simpleabi = require('simpleabi');
const ethutils = require('ethereumjs-util');
const utils = require('./utils');

// from https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
);

function generateRandomHexaByte() {
    var n = Math.floor(Math.random() * 255).toString(16);
    
    while (n.length < 2)
        n = '0' + n;
    
    return n;
}

function generateRandomPrivateKey() {
    do {
        var keytxt = '';
        
        for (var k = 0; k < 32; k++)
            keytxt += generateRandomHexaByte();
        
        var key = Buffer.from(keytxt, 'hex');
    }
    while (!ethutils.isValidPrivate(key));
    
    return key;
}

function generateAccount() {
    var privateKey = generateRandomPrivateKey();
    var publicKey = '0x' + ethutils.privateToPublic(privateKey).toString('hex');
    var address = '0x' + ethutils.privateToAddress(privateKey).toString('hex');
    
    if (!ethutils.isValidAddress(address))
        throw new Error('invalid address: ' + address);
    
    return {
        privateKey: '0x' + privateKey.toString('hex'),
        publicKey: publicKey,
        address: address
    }
}

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

function normalizeTransactionData(txdata) {
	if (txdata.from != null)
		txdata.from = utils.toHex(txdata.from);
	
	if (txdata.to != null)
		txdata.to = utils.toHex(txdata.to);

	if (txdata.value != null)
		txdata.value = utils.toHex(txdata.value);

	if (txdata.data != null)
		txdata.data = utils.toHex(txdata.data);

	if (txdata.gas != null)
		txdata.gas = utils.toHex(txdata.gas);

	if (txdata.gasPrice != null)
		txdata.gasPrice = utils.toHex(txdata.gasPrice);
	
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
        
		provider.call('eth_getStorageAt', [hash, utils.toHex(address), 'latest'], function (err, data) {
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
		
		provider.call('eth_getBlockByNumber', [utils.toHexBlock(number), txs], cb);
	};
	
	this.getBlocksByNumber = function (number, cb) {
        if (!cb)
            return promisify(cb => self.getBlocksByNumber(number, cb));
        
		provider.call('eth_getBlocksByNumber', [utils.toHexBlock(number)], cb);
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
	
	this.getTransaction = function (hash, cb) {
        if (!cb)
            return promisify(cb => self.getTransaction(hash, cb));
        
		provider.call('eth_getTransactionByHash', [utils.toHexValue(hash)], cb);
	};
	
	this.getTransactionReceipt = function (hash, cb) {
        if (!cb)
            return promisify(cb => self.getTransactionReceipt(hash, cb));
        
		provider.call('eth_getTransactionReceipt', [utils.toHexValue(hash)], cb);
	};
	
	this.getAccounts = function (cb) {
        if (!cb)
            return promisify(cb => self.getAccounts(cb));
        
		provider.call('eth_accounts', [], cb);
	};
	
	this.getBalance = function (hash, cb) {
        if (!cb)
            return promisify(cb => self.getBalance(hash, cb));
        
		provider.call('eth_getBalance', [utils.toHexAddress(hash), 'latest'], cb);
	};
	
	this.getCode = function (hash, cb) {
        if (!cb)
            return promisify(cb => self.getCode(hash, cb));
        
		provider.call('eth_getCode', [hash, 'latest'], cb);
	};
	
	this.getTransactionCount = function (hash, block, cb) {
		if (!cb && typeof block === 'function') {
			cb = block;
			block = 'pending';
		}
        
        if (!cb)
            return promisify(cb => self.getTransactionCount(hash, block || "latest", cb));
		
		if (typeof block === 'number')
			block = utils.toHex(block);
		
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
        
		provider.call('personal_unlockAccount', [address, passphrase, utils.toHex(duration)], cb);
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
        
        provider.call('eth_sendRawTransaction', [utils.toHex(data)], cb);
	}
	
	this.callTransaction = function (data, cb) {
        if (!cb)
            return promisify(cb => self.callTransaction(data, cb));
        
		provider.call('eth_call', [normalizeTransactionData(data), 'latest'], cb);
	}
    
	this.traceBlock = function (data, cb) {
        if (!cb)
            return promisify(cb => self.traceBlock(data, cb));

		provider.call('trace_block', [utils.toHexBlock(data)], cb);
	}
    
	this.traceTransaction = function (data, cb) {
        if (!cb)
            return promisify(cb => self.traceTransaction(data, cb));

		provider.call('trace_transaction', [utils.toHex(data)], cb);
	}
    
	this.debugTransaction = function (data, cb) {
        if (!cb)
            return promisify(cb => self.debugTransaction(data, cb));

		provider.call('debug_traceTransaction', [utils.toHex(data)], cb);
	}
    
    this.getLogs = function (filter, cb) {
        if (!cb)
            return promisify(cb => self.getLogs(filter, cb));
        
        if (filter.fromBlock)
            filter.fromBlock = utils.toHexBlock(filter.fromBlock);
        if (filter.toBlock)
            filter.toBlock = utils.toHexBlock(filter.toBlock);
        if (filter.address)
            filter.address = utils.toHexAddress(filter.address);
        
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
    
    this.balance = function (address, cb) {
        if (!cb)
            return promisify(cb => self.balance(address, cb));
        
        host.getBalance(address, cb);
    }
    
    this.nonce = function (address, cb) {
        if (!cb)
            return promisify(cb => self.nonce(address, cb));
        
        host.getTransactionCount(toAddress(address), cb);
    }

    this.transaction = function (hash, cb) {
        if (!cb)
            return promisify(cb => self.transaction(hash, cb));

        host.getTransaction(hash, cb);
    }
    
    this.receipt = function (hash, times, cb) {
        if (!cb)
            return promisify(cb => self.receipt(hash, times, cb));

        let n = 0;
        
        host.getTransactionReceipt(hash, getReceipt);
        
        function getReceipt(err, data) {
            if (err)
                return cb(err, null);
            
            if (data)
                return cb(null, data);
            
            if (times && ++n == times)
                return cb(null, null);
            
            setTimeout(function () {
                host.getTransactionReceipt(hash, getReceipt);
            }, 1000);
        }
    }
    
    this.transfer = function (from, to, value, options, cb) {
        if (!cb)
            return promisify(cb => self.transfer(from, to, value, options, cb));
        
        options = options || {};
        
        let gasPrice;
        let nonce;
        
        if (options.gasPrice) {
            gasPrice = options.gasPrice;
            processNonce();
            
            return;
        }
        
        host.getGasPrice(function (err, data) {
            if (err)
                return cb(err, null);
            
            gasPrice = data;
            
            processNonce();
        });
        
        return;
        
        function processNonce() {
            if (options.nonce) {
                nonce = options.nonce;
                sendTransaction();
                
                return;
            }
            
            if (typeof from !== 'object') {
                nonce = null;
                sendTransaction();
                
                return;
            }
            
            self.nonce(from.address, function (err, data) {
                if (err)
                    return cb(err, null);
                
                nonce = data;
                
                sendTransaction();
                
                return;
            });
        }
        
        function sendTransaction() {
            const tx = {
                to: toAddress(to),
                value: value,
                gasPrice: gasPrice,
                gas: options.gas || 21000
            };
            
            if (nonce != null)
                tx.nonce = nonce;
            
            if (typeof from === 'object') {
                const xtx = new Tx(tx);
                const privateKey = Buffer.from(from.privateKey.substring(2), 'hex');
                xtx.sign(privateKey);

                const serializedTx = xtx.serialize();
                
                host.sendRawTransaction('0x' + serializedTx.toString('hex'), cb);
            }
            else {
                tx.from = toAddress(from);
                host.sendTransaction(tx, cb);            
            }            
        }
    };
    
    this.deploy = function (from, code, args, options, cb) {
        if (!cb)
            return promisify(cb => self.deploy(from, code, args, options, cb));
        
        this.invoke(from, null, code, args, options, cb);
    };
    
    this.invoke = function (from, to, fn, args, options, cb) {
        if (!cb)
            return promisify(cb => self.invoke(from, to, fn, args, options, cb));
        
        options = options || {};
        
        let gasPrice;
        let nonce;
        
        if (options.gasPrice) {
            gasPrice = options.gasPrice;
            processNonce();
            
            return;
        }
        
        host.getGasPrice(function (err, data) {
            if (err)
                cb(err, null);
            
            gasPrice = data;
            
            processNonce();
            
            return;
        });
        
        return;
        
        function processNonce() {
            if (options.nonce) {
                nonce = options.nonce;
                sendTransaction();
                
                return;
            }
            
            if (typeof from !== 'object') {
                nonce = null;
                sendTransaction();
                
                return;
            }
            
            self.nonce(from.address, function (err, data) {
                if (err)
                    return cb(err, null);
                
                nonce = data;
                
                sendTransaction();
                
                return;
            });
        }

        function sendTransaction() {
            const tx = {
                value: options.value || 0,
                gasPrice: gasPrice,
                gas: options.gas || 5000000,
                data: to ? '0x' + simpleabi.encodeCall(fn, args) : utils.toHex(fn) + simpleabi.encodeValues(args)
            };
            
            if (to)
                tx.to = toAddress(to);
            
            if (nonce != null)
                tx.nonce = nonce;
            
            if (typeof from === 'object') {
                const xtx = new Tx(tx);
                const privateKey = Buffer.from(from.privateKey.substring(2), 'hex');
                xtx.sign(privateKey);

                const serializedTx = xtx.serialize();
                
                host.sendRawTransaction('0x' + serializedTx.toString('hex'), cb);
            }
            else {
                tx.from = toAddress(from);
                host.sendTransaction(tx, cb);
            }            
        }
    };

    this.call = function (from, to, fn, args, options, cb) {
        if (!cb)
            return promisify(cb => self.call(from, to, fn, args, options, cb));
        
        options = options || {};
        
        if (from.address)
            from = from.address;
        
        const tx = {
            from: toAddress(from),
            to: toAddress(to),
            value: options.value || 0,
            gasPrice: options.gasPrice || 0,
            gas: options.gas || 5000000,
            data: '0x' + simpleabi.encodeCall(fn, args)
        };
        
        host.callTransaction(tx, cb);
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
    client: createClient,
    account: generateAccount,
    
    utils: utils
}

