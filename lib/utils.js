
const simpleabi = require('simpleabi');

const valueZeroes = String('0').repeat(32 * 2);

function toHexValue(number) {
	if (typeof number === 'string') {
		if (number.length && number.substring(0, 2) === '0x')
			number = number.substring(2);
	}
    else
        number = number.toString(16);

    if (number.length < 32 * 2)
        number = valueZeroes.substring(0, 32 * 2 - number.length) + number;
	
	return '0x' + number;
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
    toHex: toHex
};

