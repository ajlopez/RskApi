
const rskapi = require('..');

exports['generate account'] = function (test) {
    const result = rskapi.account();
    
    test.ok(result);
    test.ok(result.address);
    test.ok(result.privateKey);
    test.ok(result.publicKey);
};