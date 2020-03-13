
const rskapi = require('../..');

const host = rskapi.host(process.argv[2]);

let address = process.argv[3];
let topics = process.argv[4];
const fromBlock = process.argv[5];
const toBlock = process.argv[6];

if (address === 'all')
    address = null;

if (topics === 'all')
    topics = null;

if (topics)
    topics = topics.split(';');

const filter = {};

if (address)
    filter.address = address;

if (topics)
    filter.topics = topics;

if (fromBlock)
    filter.fromBlock = fromBlock;

if (toBlock)
    filter.toBlock = toBlock;

host.getLogs(filter, function (err, data) {
	if (err)
		console.log('error', err);
	else
		console.log(data);
});


