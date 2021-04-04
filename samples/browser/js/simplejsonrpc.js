
const simplejsonrpc = (function () {
// from https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
);

function FetchProvider(url) {
    let log = false;
    const self = this;
    
	let id = 1;
	
	this.call = function (method, args, cb) {
        if (!cb)
            return promisify(cb => self.call(method, args, cb));
        
		const data = {
			id: id++,
			jsonrpc: "2.0",
			method: method,
			params: args
		};
        
        if (log)
            console.dir(data);
		
		const body = JSON.stringify(data);
        
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },        
            body: body
        })
        .then(response => response.json())
        .then(data => { if (log) console.log(data); cb(null, data); })
        .catch(err => { if (log) console.log(err); cb(null, err); });    
	}
    
    this.setLog = function (flag) {
        log = flag;
    };
}

function Client(provider) {
    const self = this;
    
	this.call = function (method, args, cb) {
        if (!cb)
            return promisify(cb => self.call(method, args, cb));
        
		provider.call(method, args, cb);
	};
    
    this.setLog = function (flag) { provider.setLog(flag); };
}

function createProvider(url) {
    return new FetchProvider(url);
}

function createClient(url) {
	return new Client(createProvider(url));
}

return {
	client: createClient
};

})();

