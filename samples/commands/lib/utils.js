
const utils = require('ethereumjs-util');

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
        
        for (let k = 0; k < 32; k++)
            keytxt += generateRandomHexaByte();
        
        key = new Buffer(keytxt, 'hex');
    }
    while (!utils.isValidPrivate(key));
    
    return key;
}

function generateAccount() {
    let privateKey = generateRandomPrivateKey();
    let publicKey = '0x' + utils.privateToPublic(privateKey).toString('hex');
    let address = '0x' + utils.privateToAddress(privateKey).toString('hex');
    
    if (!utils.isValidAddress(address))
        throw new Error('invalid address: ' + address);
    
    return {
        privateKey: '0x' + privateKey.toString('hex'),
        publicKey: publicKey,
        address: address
    }
}

function getAddress(config, user) {
    if (user.substring(0, 2).toLowerCase() === '0x')
        return user;
    
    if (config.accounts && config.accounts[user])
        if (config.accounts[user].address)
            return config.accounts[user].address;
        else
            return config.accounts[user];
        
    if (config.instances && config.instances[user])
        return config.instances[user].address;
        
    return user;
}

function getInstanceAddress(config, name) {
    if (name.substring(0, 2).toLowerCase() === '0x')
        return name;
    
    if (!config.instances)
        return name;
    
    if (config.instances[name])
        return config.instances[name].address || config.instances[name];
    
    return name;
}

function getAccount(config, user) {
    if (user.substring(0, 2).toLowerCase() === '0x')
        return user;
    
    if (!config.accounts)
        return user;
    
    if (config.accounts[user])
        return config.accounts[user];
        
    return user;
}

function getValue(value) {
    if (typeof value === 'string' && value.substring(0, 2).toLowerCase() === '0x')
        return value;
    
    return parseInt(value);
}

function processArgument(config, arg) {
    if (config.accounts && config.accounts[arg])
        if (config.accounts[arg].address)
            return config.accounts[arg].address;
        else
            return config.accounts[arg];
        
    if (config.instances && config.instances[arg])
        return config.instances[arg].address;
        
    return arg;
}

function processArguments(config, args) {
    if (!args)
        return null;
    
    if (typeof args === 'string')
        args = args.split(';');
    
    for (let k = 0, l = args.length; k < l; k++)
        args[k] = processArgument(config, args[k]);
    
    return args;
}

module.exports = {
    generateAccount: generateAccount,
    getAddress: getAddress,
    getInstanceAddress: getInstanceAddress,
    getAccount: getAccount,
    getValue: getValue,
    getArguments: processArguments
};

