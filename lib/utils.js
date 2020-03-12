
const simpleabi = require('simpleabi');

const valueZeroes = String('0').repeat(32 * 2);

function toHexValueWithLength(number, length) {
	if (typeof number === 'string') {
		if (number.length && number.substring(0, 2) === '0x')
			number = number.substring(2);
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

module.exports = {
    encodeFunction: simpleabi.encodeFunction,
    encodeCall: simpleabi.encodeCall,
    
    toHexBlock: toHexBlock,
    toHexValue: toHexValue,
    toHexAddress: toHexAddress,
    toHex: toHex
};

