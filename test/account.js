
const rskapi = require('..');

const account = {
    "privateKey": "0x6f381a30325494a9f89804911616efeedf638bc9b777dd32098e32a8d33d3b5a",
    "publicKey": "0xd3bec3a05fc449801ee8612d41a5afa65dddf793260021008e93e318740b483bb0a153bd877b8283bfb15616cb506d4e9dd9c93ed465bbf76727fb7f2c2414b3",
    "address": "0xb090408afb46eb0b27334deb8d674b4cc7de2d42"
};

exports['generate account'] = function (test) {
    const result = rskapi.account();
    
    test.ok(result);
    test.ok(result.address);
    test.ok(result.privateKey);
    test.ok(result.publicKey);
};

exports['generate account using private key'] = function (test) {
    const result = rskapi.account(account.privateKey);
    
    test.ok(result);
    test.deepEqual(result, account);
};