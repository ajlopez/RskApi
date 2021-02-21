
const fs = require('fs');
const path = require('path');

function loadBlock(hash, datadir) {
    const blockdir = path.join(datadir, 'blocks', hash.substring(0,4));
    const filename = path.join(blockdir, hash + '.json');
    
    return JSON.parse(fs.readFileSync(filename).toString());
}

module.exports = {
    loadBlock
}

