
const simpleabi = require('simpleabi');

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
    toHex: toHex
};

