
const fs = require('fs');

let rskapi = null;
let localrskapi = null;

try {
    rskapi = require('rskapi');
}
catch (ex) {
    localrskapi = require('../../..');
}

function loadConfiguration(filename) {
    try {
        return JSON.parse(fs.readFileSync(filename).toString());
    }
    catch (ex) {
        return {
            host: null,
            accounts: {},
            instances: {},
            options: {}
        };
    }
}

function saveConfiguration(filename, config) {
    fs.writeFileSync(filename, JSON.stringify(config, null, 4));
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
        if (config.instances[user].address)
            return config.instances[user].address;
        else
            return config.instances[user];
        
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
    if (arg.length && arg[0] === '"' && arg[arg.length - 1] === '"')
            return arg.substring(1, arg.length - 1);
        
    if (arg.length && arg[0] === "'" && arg[arg.length - 1] === "'")
            return arg.substring(1, arg.length - 1);
        
    if (config.accounts && config.accounts[arg])
        if (config.accounts[arg].address)
            return config.accounts[arg].address;
        else
            return config.accounts[arg];
        
    if (config.instances && config.instances[arg])
        if (config.instances[arg].address)
            return config.instances[arg].address;
        else
            return config.instances[arg];
        
    return arg;
}

function processArguments(config, args) {
    if (!args)
        return null;
    
    if (typeof args === 'string')
        args = args.split(',');
    
    for (let k = 0, l = args.length; k < l; k++)
        args[k] = processArgument(config, args[k]);
    
    return args;
}

function getConfigurationOptions(config) {
    const options = {};
    
    if (!config || !config.options)
        return options;
    
    if (config.options.gas)
        options.gas = config.options.gas;
    
    if (config.options.gasPrice)
        options.gasPrice = config.options.gasPrice;
    
    return options;
}

module.exports = {
    rskapi: rskapi ? rskapi : localrskapi,
    
    getAddress: getAddress,
    getInstanceAddress: getInstanceAddress,
    getAccount: getAccount,
    getValue: getValue,
    getArguments: processArguments,
    
    loadConfiguration: loadConfiguration,
    saveConfiguration: saveConfiguration,
    getConfigurationOptions: getConfigurationOptions
};

