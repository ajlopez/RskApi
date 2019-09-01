
function getAddress(config, user) {
    if (!config.accounts)
        return user;
    
    if (config.accounts[user])
        if (config.accounts[user].address)
            return config.accounts[user].address;
        else
            return config.accounts[user];
        
    return user;
}

module.exports = {
    getAddress: getAddress
};