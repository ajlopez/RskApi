
const fs = require('fs');
const path = require('path');
const readline = require('readline');

function loadBlock(hash, datadir) {
    const blockdir = path.join(datadir, 'blocks', hash.substring(0,4));
    const filename = path.join(blockdir, hash + '.json');
    
    return JSON.parse(fs.readFileSync(filename).toString());
}

function processBlocks(from, to, datadir, fn) {
    const filename = path.join(datadir, 'chain.txt');
    
    const filestream = fs.createReadStream(filename);
    
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });
    
    rl.on('line', function (line) {
        const parts = line.trim().split(',');
        
        if (parts.length != 2)
            return;
        
        const number = parseInt(parts[0]);
        
        if (number < from || number > to)
            return;
        
        const hash = parts[1];
        
        const block = loadBlock(hash, datadir);
        
        fn(block);
    });
}

module.exports = {
    loadBlock,
    processBlocks
}

