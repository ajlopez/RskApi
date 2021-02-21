
const utils = require('./lib/utils');
const blocks = require('./lib/blocks');

const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const hash = process.argv[2];
const block = blocks.loadBlock(hash, config.data);

console.log(block);
