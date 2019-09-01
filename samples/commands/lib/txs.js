
const simpleabi = require('simpleabi');
const Tx = require('ethereumjs-tx');

async function callContract(host, tx) {
    return await host.callTransaction(tx);
}

async function invokeContract(host, address, fnhash, args, options) {
    if (options.from.privateKey) {
        const nonce = await host.getTransactionCount(options.from.address, 'pending');
        
        const tx = {
            gas: options.gas || 1000000,
            gasPrice: options.gasPrice || 0,
            value: options.value || 0,
            to: address,
            nonce: nonce,
            data: fnhash + simpleabi.encodeValues(args)
        };
        
        console.dir(tx);
        
        const xtx = new Tx(tx);
        const privateKey = new Buffer(options.from.privateKey.substring(2), 'hex');
        xtx.sign(privateKey);
        const serializedTx = xtx.serialize();
        
        console.log('0x' + serializedTx.toString('hex'));
        
        return await host.sendRawTransaction('0x' + serializedTx.toString('hex'));
    }
    else {
        const tx = {
            from: options.from,
            gas: options.gas || 1000000,
            gasPrice: options.gasPrice || 0,
            value: options.value || 0,
            to: address,
            data: fnhash + simpleabi.encodeValues(args)
        };
        
        return await host.sendTransaction(tx);
    }
}

async function transferValue(host, receiver, amount, options) {
    if (options.from.privateKey) {
        const nonce = await host.getTransactionCount(options.from.address, 'pending');

        const tx = {
            gas: options.gas || 1000000,
            gasPrice: options.gasPrice || 0,
            value: amount || 0,
            nonce: nonce,
            to: receiver
        };
        
        const xtx = new Tx(tx);
        const privateKey = new Buffer(options.from.privateKey.substring(2), 'hex');
        xtx.sign(privateKey);

        const serializedTx = xtx.serialize();

        return await host.sendRawTransaction('0x' + serializedTx.toString('hex'));
    }
    else {
        const tx = {
            from: options.from,
            gas: options.gas || 1000000,
            gasPrice: options.gasPrice || 0,
            value: amount || 0,
            to: receiver
        };
        
        console.dir(tx);
        
        return await host.sendTransaction(tx);
    }
}

async function sendTransaction(host, sender, tx) {
    if (sender.address) {
        const nonce = await host.getTransactionCount(sender.address, 'pending');
        
        tx.nonce = nonce;
        
        const xtx = new Tx(tx);
        const privateKey = new Buffer(sender.privateKey.substring(2), 'hex');
        xtx.sign(privateKey);

        const serializedTx = xtx.serialize();

        return await host.sendRawTransaction('0x' + serializedTx.toString('hex'));
    }
    else {
        tx.from = sender;
        return await host.sendTransaction(tx);
    }
}

async function getTransactionReceipt(host, txhash) {
    let txr = await host.getTransactionReceiptByHash(txhash);
    
    while (txr == null)
        txr = await host.getTransactionReceiptByHash(txhash);
    
    return txr;
}

module.exports = {
    call: callContract,
    invoke: invokeContract,
    transfer: transferValue,
    send: sendTransaction,
    receipt: getTransactionReceipt
};


