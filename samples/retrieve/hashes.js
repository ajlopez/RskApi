
const utils = require('./lib/utils');
const blocks = require('./lib/blocks');

const rskapi = utils.rskapi;
const config = utils.loadConfiguration('./config.json');

const from = parseInt(process.argv[2]);
const to = parseInt(process.argv[3]);

blocks.processBlocks(from, to, config.data,
    function (block) {
        console.log(parseInt(block.number), block.hash);
    }
);
