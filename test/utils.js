
const utils = require('../lib/utils');

exports['block to hex'] = function (test) {
    test.equal(utils.toHexBlock('earliest'), 'earliest');
    test.equal(utils.toHexBlock('latest'), 'latest');
    test.equal(utils.toHexBlock('pending'), 'pending');
    test.equal(utils.toHexBlock(0), '0x0');
    test.equal(utils.toHexBlock(1), '0x1');
    test.equal(utils.toHexBlock(42), '0x2a');
    test.equal(utils.toHexBlock('0x2a'), '0x2a');
};

