
const rskapi = require('../..');

const fnsignature = process.argv[2];

console.log(rskapi.utils.encodeFunction(fnsignature));
