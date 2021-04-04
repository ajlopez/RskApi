
const rskapi = (function () {
    
const sjr = simplejsonrpc;
const Tx = ethereumjs.Tx;
const ethutils = ethereumjs.Util;

const utils = (function() {

    const valueZeroes = String('0').repeat(32 * 2);

    function toHexValueWithLength(number, length) {
        if (typeof number === 'string') {
            if (number.length && number.substring(0, 2) === '0x')
                number = number.substring(2);
            else
                number = parseInt(number).toString(16);
        }
        else
            number = number.toString(16);

        if (number.length < length)
            number = valueZeroes.substring(0, length - number.length) + number;
        
        return '0x' + number;
    }

    function toHexValue(number) {
        return toHexValueWithLength(number, 32 * 2);
    }

    function toHexAddress(number) {
        return toHexValueWithLength(number, 20 * 2);
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

    return {
        encodeFunction: simpleabi.encodeFunction,
        encodeCall: simpleabi.encodeCall,
        
        toHexBlock: toHexBlock,
        toHexValue: toHexValue,
        toHexAddress: toHexAddress,
        toHex: toHex
    };

    
})();

// from https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
);

function generateRandomHexaByte() {
    let n = Math.floor(Math.random() * 255).toString(16);
    
    while (n.length < 2)
        n = '0' + n;
    
    return n;
}

function generateRandomPrivateKey() {
    let key;
    
    do {
        let keytxt = '';
        
        for (var k = 0; k < 32; k++)
            keytxt += generateRandomHexaByte();
        
        key = Buffer.from(keytxt, 'hex');
    }
    while (!ethutils.isValidPrivate(key));
    
    return key;
}

function generateAccount(pk) {
    if (pk)
        return generateAccountFromPrivateKey(pk);
        
    const privateKey = generateRandomPrivateKey();
    const publicKey = '0x' + ethutils.privateToPublic(privateKey).toString('hex');
    const address = '0x' + ethutils.privateToAddress(privateKey).toString('hex');
    
    if (!ethutils.isValidAddress(address))
        throw new Error('invalid address: ' + address);
    
    return {
        privateKey: '0x' + privateKey.toString('hex'),
        publicKey: publicKey,
        address: address
    }
}

function generateAccountFromPrivateKey(pk) {
    if (pk.startsWith('0x'))
        pk = pk.substring(2);
        
    var privateKey = Buffer.from(pk, 'hex');
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
	
	this.getStorageAt = function (address, offset, cb) {
        if (!cb)
            return promisify(cb => self.getStorageAt(address, offset, cb));
        
		provider.call('eth_getStorageAt', [utils.toHexAddress(address), utils.toHexValue(offset), 'latest'], function (err, data) {
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
        
        if (txs == null)
            txs = false;
        
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
        
        if (txs == null)
            txs = false;
        
        if (!cb)
            return promisify(cb => self.getBlockByHash(hash, txs || false, cb));
		
		provider.call('eth_getBlockByHash', [utils.toHexValue(hash), txs], cb);
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
	
	this.getBalance = function (address, block, cb) {
		if (!cb && typeof block === 'function') {
			cb = block;
			block = null;
		}
        
        if (!block)
            block = 'latest';

        if (!cb)
            return promisify(cb => self.getBalance(address, block, cb));
        
		provider.call('eth_getBalance', [utils.toHexAddress(address), utils.toHexBlock(block)], cb);
	};
	
	this.getCode = function (address, cb) {
        if (!cb)
            return promisify(cb => self.getCode(address, cb));
        
		provider.call('eth_getCode', [utils.toHexAddress(address), 'latest'], cb);
	};
	
	this.getTransactionCount = function (address, block, cb) {
		if (!cb && typeof block === 'function') {
			cb = block;
			block = null;
		}
        
        if (!block)
            block = 'pending';
        
        if (!cb)
            return promisify(cb => self.getTransactionCount(address, block || "latest", cb));
		
		provider.call('eth_getTransactionCount', [utils.toHexAddress(address), utils.toHexBlock(block)], cb);
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
	
	this.listPersonalAccounts = function (cb) {
        if (!cb)
            return promisify(cb => self.listPersonalAccounts(cb));
        
		provider.call('personal_listAccounts', [], cb);
	};
	
	this.importPersonalRawKey = function (privateKey, passphrase, cb) {
        if (!cb)
            return promisify(cb => self.importPersonalRawKey(privateKey, passphrase, cb));
        
		provider.call('personal_importRawKey', [privateKey, passphrase], cb);
	};

	this.sendTransaction = function (data, cb) {
        if (!cb)
            return promisify(cb => self.sendTransaction(data, cb));
        
		provider.call('eth_sendTransaction', [normalizeTransactionData(data)], cb);
	}
	
	this.estimateGas = function (data, cb) {
        if (!cb)
            return promisify(cb => self.estimateGas(data, cb));
        
		provider.call('eth_estimateGas', [normalizeTransactionData(data)], cb);
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
        if (filter.topics)
            if (Array.isArray(filter.topics)) {
                const topics = [];

                for (let k = 0, l = filter.topics.length; k < l; k++)
                    topics.push(utils.toHexValue(filter.topics[k]));

                filter.topics = topics;
            }
            else
                filter.topics = [ utils.toHexValue(filter.topics) ]
        
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
    
    this.balance = function (address, block, cb) {
		if (!cb && typeof block === 'function') {
			cb = block;
			block = null;
		}

        if (!cb)
            return promisify(cb => self.balance(address, block, cb));
        
        host.getBalance(address, block, cb);
    }
    
    this.nonce = function (address, block, cb) {
		if (!cb && typeof block === 'function') {
			cb = block;
			block = null;
		}

        if (!cb)
            return promisify(cb => self.nonce(address, block, cb));
        
        host.getTransactionCount(address, block, cb);
    }

    this.code = function (address, cb) {
        if (!cb)
            return promisify(cb => self.code(address, cb));
        
        host.getCode(address, cb);
    }
    
    this.number = function (cb) {
        if (!cb)
            return promisify(cb => self.number(cb));
        
        host.getBlockNumber(cb);
    }
    
    this.block = function (id, txs, cb) {
		if (!cb && typeof txs === 'function') {
			cb = txs;
			txs = false;
		}
        
        if (!cb)
            return promisify(cb => self.block(id, txs, cb));
        
        if (typeof id === 'number' || id.length < 10)
            host.getBlockByNumber(id, txs, cb);
        else
            host.getBlockByHash(id, txs, cb);    
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
    
    this.npeers = function (cb) {
        if (!cb)
            return promisify(cb => self.npeers(cb));
        
        host.getPeerCount(cb);
    }
    
    this.peers = function (cb) {
        if (!cb)
            return promisify(cb => self.peers(cb));
        
        host.getPeerList(cb);
    }
    
    this.scoring = function (cb) {
        if (!cb)
            return promisify(cb => self.scoring(cb));
        
        host.getScoringPeerList(cb);
    }
    
    this.storage = function (address, offset, cb) {
        if (!cb)
            return promisify(cb => self.storage(address, offset, cb));
        
        host.getStorageAt(address, offset, cb);
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
                to: utils.toHexAddress(to),
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
                tx.from = utils.toHexAddress(from);
                host.sendTransaction(tx, cb);            
            }            
        }
    };
    
    this.deploy = function (from, code, args, options, cb) {
        if (!cb)
            return promisify(cb => self.deploy(from, code, args, options, cb));
        
        this.invoke(from, null, code, args, options, cb);
    };
    
    this.estimate = function (from, to, fn, args, options, cb) {
        if (!cb)
            return promisify(cb => self.estimate(from, to, fn, args, options, cb));
        
        options = options || {};
        
        let gasPrice;
        let nonce;
        
        if (options.gasPrice) {
            gasPrice = options.gasPrice;
            estimateTransaction();
            
            return;
        }
        
        host.getGasPrice(function (err, data) {
            if (err)
                cb(err, null);
            
            gasPrice = data;
            
            estimateTransaction();
            
            return;
        });
        
        return;

        function estimateTransaction() {
            const tx = {
                value: options.value || 0,
                gasPrice: gasPrice,
                gas: options.gas || 5000000
            };
            
            if (fn)
                tx.data = to ? '0x' + simpleabi.encodeCall(fn, args) : utils.toHex(fn) + simpleabi.encodeValues(args, options.types);
            
            if (to)
                tx.to = utils.toHexAddress(to);
            
            if (typeof from === 'object')
                tx.from = from.address;
            else
                tx.from = utils.toHexAddress(from);
            
            host.estimateGas(tx, cb);
        }
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
                data: to ? '0x' + simpleabi.encodeCall(fn, args) : utils.toHex(fn) + simpleabi.encodeValues(args, options.types)
            };
            
            if (to)
                tx.to = utils.toHexAddress(to);
            
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
                tx.from = utils.toHexAddress(from);
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
            from: utils.toHexAddress(from),
            to: utils.toHexAddress(to),
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

return {
	host: createHost,
    client: createClient,
    account: generateAccount,
    
    utils: utils
};

})();

