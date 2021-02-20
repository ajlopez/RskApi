
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const fs = require('fs');
const path = require('path');

const config = utils.loadConfiguration('./config.json');

const from = parseInt(process.argv[2]);
const to = parseInt(process.argv[3]);

const client = rskapi.client(config.host);

const ndigits = to - from > 200000 ? 2 : 1;

(async function() {
    fs.mkdirSync(config.data, { recursive: true });
    
    const stream = fs.createWriteStream(path.join(config.data, 'chain.txt'), { flags: 'a' });
    
    for (let k = from; k <= to; k++) {
        const block = await client.block(k, true);
        const hash = block.hash;
        
        const dirname = path.join(config.data, 'blocks', hash.substring(0, 2 + ndigits * 2));
        
        fs.mkdirSync(dirname, { recursive: true });
        
        const filename = path.join(dirname, hash + '.json');
        
        if (fs.existsSync(filename))
            continue;
        
        fs.writeFileSync(filename, JSON.stringify(block));
        
        stream.write(k + ',' + hash + '\r\n');
        
        if (k % 100 == 0)
            process.stdout.write('.');
    }
    
    stream.end();
    
    console.log('done');
})();

