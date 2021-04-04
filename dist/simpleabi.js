
const simpleabi = (function() {
const keccak256 = keccak_256;

let Buffer;

if (typeof global !== 'undefined' && global.Buffer)
    Buffer = global.Buffer;
else if (typeof window !== 'undefined' && window.Buffer)
    Buffer = window.Buffer;
else if (typeof ethereumjs !== 'undefined' && ethereumjs.Buffer && ethereumjs.Buffer.Buffer)
    Buffer = ethereumjs.Buffer.Buffer;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
if (Number.MAX_SAFE_INTEGER === undefined)
    Number.MAX_SAFE_INTEGER = 9007199254740991;

const maxhexadigits = Number.MAX_SAFE_INTEGER.toString(16).length;

// https://stackoverflow.com/questions/1877475/repeat-character-n-times
const maxinteger = parseInt('1' + Array(maxhexadigits).join('0'), 16);

function stringToBuffer(str, encoding) {
    if (Buffer.from)
        return Buffer.from(str, encoding);
        
    return new Buffer(str, encoding);
}

function normalizeHexaString(str) {
	if (str.substring(0, 2) === '0x')
		return str.substring(2);
	
	return str;
}

function isDigit(digit) {
    return digit >= '0' && digit <= '9';
}

function isInteger(digits) {
    for (let k = 0, l = digits.length; k < l; k++)
        if (!isDigit(digits[k]))
            return false;
        
    return true;
}

function isSafeInteger(digits) {
    let p;
    
	for (p = 0; p < digits.length; p++)
		if (digits[p] != '0')
			break;
		
	return digits.length - p < maxhexadigits;
}

function fillLeftTo64(str, digit) {
	digit = digit == null ? '0' : digit;
	digit2 = digit + digit;
	
	if (str.length % 2)
		str = digit + str;
	
	while (str.length % 64)
		str = digit2 + str;
	
	return str;
}

function fillRightTo64(str, digit) {
	digit = digit == null ? '0' : digit;
	digit2 = digit + digit;
	
	if (str.length % 2)
		str += digit;
	
	while (str.length % 64)
		str += digit2;
	
	return str;
}

function encodeStringValue(value) {
	if (value.substring(0, 2) === '0x')
		return fillLeftTo64(value.substring(2));
	
    const length = fillLeftTo64(value.length.toString(16));
    const encoded = fillRightTo64(stringToBuffer(value).toString('hex'));
    
    return length + encoded;
}

function encodeBytesValue(buffer) {
    const length = fillLeftTo64(buffer.length.toString(16));
    const encoded = fillRightTo64(buffer.toString('hex'));
    
    return length + encoded;
}

function encodeNegativeInteger(value) {
	const newvalue = maxinteger + value;
	return fillLeftTo64(newvalue.toString(16), 'f');
}

function encodeArray(value) {
	const length = fillLeftTo64(value.length.toString(16));
	const encoded = [];
	
	for (let n in value)
		encoded.push(encodeValue(value[n]));
	
	return length + encoded.join('');
}

function encodeValue(value, type) {
    if (type)
        return encodeValueWithType(value, type);
    
    if (typeof value === 'string') {
        if (isInteger(value)) {
            if (isSafeInteger(value))
                return encodeValue(parseInt(value));
            
            value = '0x' + (new BN(value, 10)).toString(16);
            
            return encodeValue(value);
        }
        
        return encodeStringValue(value);
    }
    
    if (value instanceof Buffer)
        return encodeBytesValue(value);
    
	if (Array.isArray(value))
		return encodeArray(value);
	
	if (value < 0)
		return encodeNegativeInteger(value);
	
  	const encoded = value.toString(16);

    return fillLeftTo64(encoded);
}

function encodeValueWithType(value, type) {
    if (type === 'string')
        return encodeStringValue(value.toString());
    
    if (type === 'bytes') {
        if (value.substring(0, 2).toLowerCase() === '0x')
            value = value.substring(2);
        
        const bytes = stringToBuffer(value, 'hex');
        
        return encodeValue(bytes);
    }
    
    if (type.startsWith('bytes')) {
        const n = parseInt(type.substring(5));
        
        if (typeof value !== 'string') {
            value = value.toString(16);
            
            if (value.length % 2)
                value = '0' + value;
        }
        
        if (value.substring(0, 2).toLowerCase() === '0x')
            value = value.substring(2);
            
        while (value.length < n * 2)
            value = value + '00';
            
        value = value.substring(0, n * 2);
        
        return fillRightTo64(value);
    }
    
    return encodeValue(value);
}

function encodeValues(values, types) {
    if (values == null)
        return '';
    
    if (types)
        return encodeValuesWithTypes(values, types);
    
	const encoded = [];
	
	for (let n in values)
		encoded.push(encodeValue(values[n]));
	
	let result = '';
	let extend = '';
	
	for (let n in encoded)
		if (encoded[n].length === 64)
			result += encoded[n];
		else {
			result += fillLeftTo64((values.length * 32 + Math.floor(extend.length / 2)).toString(16));
			extend += encoded[n];
		}
		
	return result + extend;
}

function encodeValuesWithTypes(values, types) {
	const encoded = [];
	
	for (let n in values)
		encoded.push(encodeValue(values[n], types[n]));
	
	let result = '';
	let extend = '';
	
	for (let n in encoded)
		if (encoded[n].length === 64)
			result += encoded[n];
		else {
			result += fillLeftTo64((values.length * 32 + Math.floor(extend.length / 2)).toString(16));
			extend += encoded[n];
		}
		
	return result + extend;
}

function splitValues(values) {
	var splits = [];
	
	for (let k = 0; k < values.length; k += 64)
		splits.push(values.substring(k, k + 64));
	
	return splits;
}

function decodeSplittedStringValue(index, splits) {
	const offset = Math.floor(parseInt('0x' + splits[index], 16) / 32);
	const length = parseInt('0x' + splits[offset], 16);
	
	const nsplits = Math.ceil(length / 32);
	
	const data = splits.slice(offset + 1, offset + 1 + nsplits).join('').substring(0, length * 2);
	
	return stringToBuffer(data, 'hex').toString();
}

function decodeSplittedBytesValue(index, splits) {
	const offset = Math.floor(parseInt('0x' + splits[index], 16) / 32);
	const length = parseInt('0x' + splits[offset], 16);
	
	const nsplits = Math.ceil(length / 32);
	
	const data = splits.slice(offset + 1, offset + 1 + nsplits).join('').substring(0, length * 2);
	
	return stringToBuffer(data, 'hex');
}

function decodeBytesNValue(value, nbytes) {
    return '0x' + value.substring(0, nbytes * 2);
}

function decodeValuesWithTypes(str, types) {
	const value = normalizeHexaString(str);

	const splits = splitValues(value);
	
	const result = [];
	
	for (let n in types)
		if (types[n] === 'string')
			result.push(decodeSplittedStringValue(n, splits));
		else if (types[n] === 'bytes')
			result.push(decodeSplittedBytesValue(n, splits));
		else if (types[n].startsWith('bytes'))
			result.push(decodeBytesNValue(splits[n], parseInt(types[n].substring(5))));
		else if (types[n] === 'bool')
			result.push(asSafeInteger(splits[n]) != 0);
		else
			result.push(decodeSplit(splits[n]));
	
	if (result.length === 1)
		return result[0];
	
	return result;
}

function decodeSplit(split) {
    if (isSafeInteger(split))
        return parseInt('0x' + split, 16);
    else
        return '0x' + split;
}

function decodeValues(str, types) {
	if (types)
		return decodeValuesWithTypes(str, types);
	
	const value = normalizeHexaString(str);
	
	if (value.length <= 64)
        return decodeSplit(value);

	const splits = splitValues(value);
	
	for (let n in splits)
        splits[n] = decodeSplit(splits[n]);
	
	return splits;
}

function asSafeInteger(str) {
	const value = normalizeHexaString(str);
	
	if (!isSafeInteger(value))
		return str;
	
	return parseInt('0x' + value, 16);
}

function encodeFunction(fn) {
    return keccak256(fn).substring(0, 8);
}

function encodeCall(fn, values) {
    const p = fn.indexOf('(');
    const types = fn.substring(p + 1, fn.length - 1).split(',');

    return keccak256(fn).substring(0, 8) + encodeValues(values, types);
}

return {
    encodeCall: encodeCall,
    encodeFunction: encodeFunction,
    encodeValue: encodeValue,
	encodeValues: encodeValues,
	decodeValues: decodeValues,
	asSafeInteger: asSafeInteger,
    stringToBuffer: stringToBuffer
};

})();

