
function getAddress(config, user) {
    if (user.substring(0, 2).toLowerCase() === '0x')
        return user;
    
    if (!config.accounts)
        return user;
    
    if (config.accounts[user])
        if (config.accounts[user].address)
            return config.accounts[user].address;
        else
            return config.accounts[user];
        
    return user;
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

module.exports = {
    getAddress: getAddress,
    getAccount: getAccount,
    getValue: getValue
};