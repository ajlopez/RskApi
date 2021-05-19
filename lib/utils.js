
const simpleabi = require('simpleabi');
const BN = require('bn.js');

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
if (Number.MAX_SAFE_INTEGER === undefined)
    Number.MAX_SAFE_INTEGER = 9007199254740991;

const maxhexadigits = Number.MAX_SAFE_INTEGER.toString(16).length;

// https://stackoverflow.com/questions/1877475/repeat-character-n-times
const maxinteger = parseInt('1' + Array(maxhexadigits).join('0'), 16);

function isSafeInteger(digits) {
    let p;
    
	for (p = 0; p < digits.length; p++)
		if (digits[p] != '0')
			break;
		
	return digits.length - p < maxhexadigits;
}

const valueZeroes = String('0').repeat(32 * 2);

function toHexValueWithLength(number, length) {
	if (typeof number === 'string') {
		if (number.length && number.substring(0, 2) === '0x')
			number = number.substring(2);
        else
            number = parseInt(number).toString(16);
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

function toHexNumber(number) {
	if (typeof number === 'string') {
		if (number.length && number.substring(0, 2) === '0x')
			return number;
		
        if (!isSafeInteger(number))
            return '0x' + (new BN(number, 10)).toString(16);
            
        number = parseInt(number);
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
    toHex: toHex,
    toHexNumber: toHexNumber
};

