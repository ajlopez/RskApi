
const utils = require('..').utils;
const keccak256 = require('simpleabi/lib/sha3').keccak_256;
const stringToBuffer = require('simpleabi').stringToBuffer;

const zeroes = '0x0000000000000000000000000000000000000000000000000000000000000000';

function toValue(text) {
    return zeroes.substring(0, zeroes.length - text.length) + text;
}

function toAddress(text) {
    return zeroes.substring(0, zeroes.length - 12 * 2 - text.length) + text;
}

exports['encode value'] = function (test) {
    test.equal(utils.toHexValue(0), zeroes);
    test.equal(utils.toHexValue(1), toValue('1'));
    test.equal(utils.toHexValue(42), toValue('2a'));
    test.equal(utils.toHexValue('0x2a'), toValue('2a'));
}

exports['to hex number'] = function (test) {
    test.equal(utils.toHexNumber(0), '0x0');
    test.equal(utils.toHexNumber(1), '0x1');
    test.equal(utils.toHexNumber(42), '0x2a');
    test.equal(utils.toHexNumber('0x2a'), '0x2a');
    test.equal(utils.toHexNumber('1000000000000000000'), '0xde0b6b3a7640000');
}

exports['encode address'] = function (test) {
    test.equal(utils.toHexAddress(0), toAddress('0'));
    test.equal(utils.toHexAddress(1), toAddress('1'));
    test.equal(utils.toHexAddress(42), toAddress('2a'));
    test.equal(utils.toHexAddress('0x2a'), toAddress('2a'));
}

exports['block to hex'] = function (test) {
    test.equal(utils.toHexBlock('earliest'), 'earliest');
    test.equal(utils.toHexBlock('latest'), 'latest');
    test.equal(utils.toHexBlock('pending'), 'pending');
    test.equal(utils.toHexBlock(0), '0x0');
    test.equal(utils.toHexBlock(1), '0x1');
    test.equal(utils.toHexBlock(42), '0x2a');
    test.equal(utils.toHexBlock('0x2a'), '0x2a');
};

exports['encode function signature'] = function (test) {
    const result = utils.encodeFunction('add(uint256)');
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 8);
    test.equal(result, keccak256('add(uint256)').substring(0, 8));
};

exports['encode function call without arguments'] = function (test) {
    const result = utils.encodeCall('increment()');
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 8);
    test.equal(result, keccak256('increment()').substring(0, 8));
};

exports['encode call with integer values'] = function (test) {
    var result = utils.encodeCall('add(uint256,uint256,uint256)', [ 1, 2, 3 ]);
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 8 + 64 * 3);
    test.equal(result, 
        keccak256('add(uint256,uint256,uint256)').substring(0, 8)
        + '000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003');
};

exports['encode call with string value'] = function (test) {
    var result = utils.encodeCall('setMessage(string)', [ "hello" ]);
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 8 + 64 * 3);
    test.equal(result, 
        keccak256('setMessage(string)').substring(0, 8)
		+ '0000000000000000000000000000000000000000000000000000000000000020'
		+ '0000000000000000000000000000000000000000000000000000000000000005'
		+ stringToBuffer('hello').toString('hex') + '000000000000000000000000000000000000000000000000000000');
};

exports['encode call with hexadecimal string value'] = function (test) {
    var result = utils.encodeCall('setManager(address)', [ "0x01020304" ]);
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 8 + 64);
    test.equal(result, 
        keccak256('setManager(address)').substring(0, 8)
		+ '0000000000000000000000000000000000000000000000000000000001020304');
};

exports['encode call with numeric string value as string'] = function (test) {
    var result = utils.encodeCall('setMessage(string)', [ "42" ]);
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 8 + 64 * 3);
    test.equal(result, 
        keccak256('setMessage(string)').substring(0, 8)
		+ '0000000000000000000000000000000000000000000000000000000000000020'
		+ '0000000000000000000000000000000000000000000000000000000000000002'
		+ '3432000000000000000000000000000000000000000000000000000000000000');
};

exports['encode call with numeric string value as unsigned integer'] = function (test) {
    var result = utils.encodeCall('add(uint256)', [ "42" ]);
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 8 + 64);
    test.equal(result, 
        keccak256('add(uint256)').substring(0, 8)
		+ '000000000000000000000000000000000000000000000000000000000000002a');
};

exports['encode call with two numeric strings value as string'] = function (test) {
    var result = utils.encodeCall('process(string,string)', [ "42", "1" ]);
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 8 + 64 * 6);
    test.equal(result, 
        keccak256('process(string,string)').substring(0, 8)
		+ '0000000000000000000000000000000000000000000000000000000000000040'
		+ '0000000000000000000000000000000000000000000000000000000000000080'
		+ '0000000000000000000000000000000000000000000000000000000000000002'
		+ '3432000000000000000000000000000000000000000000000000000000000000'
		+ '0000000000000000000000000000000000000000000000000000000000000001'
		+ '3100000000000000000000000000000000000000000000000000000000000000');
};

exports['encode hexadecimal string as bytes'] = function (test) {
    var result = utils.encodeCall('process(bytes)', [ '0x123456' ]);
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 8 + 64 * 3);
    test.equal(result, 
        keccak256('process(bytes)').substring(0, 8)
		+ '0000000000000000000000000000000000000000000000000000000000000020'
		+ '0000000000000000000000000000000000000000000000000000000000000003'
		+ '1234560000000000000000000000000000000000000000000000000000000000');
};

exports['encode call with two string value'] = function (test) {
    var result = utils.encodeCall('process(string,string)', [ "hello", "world" ]);
    
    test.ok(result);
    test.equal(typeof result, 'string');
    test.equal(result.length, 8 + 64 * 6);
    test.equal(result, 
        keccak256('process(string,string)').substring(0, 8)
		+ '0000000000000000000000000000000000000000000000000000000000000040'
		+ '0000000000000000000000000000000000000000000000000000000000000080'
		+ '0000000000000000000000000000000000000000000000000000000000000005'
		+ stringToBuffer('hello').toString('hex') + '000000000000000000000000000000000000000000000000000000'
		+ '0000000000000000000000000000000000000000000000000000000000000005'
		+ stringToBuffer('world').toString('hex') + '000000000000000000000000000000000000000000000000000000');
};

