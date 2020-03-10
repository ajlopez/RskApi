
const rskapi = require('../..');

const fnsignature = process.argv[2];
let args = process.argv[3];

if (args)
    args = args.split(';');

console.log(rskapi.utils.encodeCall(fnsignature, args));
