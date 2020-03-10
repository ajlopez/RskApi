# RskApi

[RSK](http://rsk.co) API, accesing a running node using JSON RPC. It's a simple replacement to the usual web3
interface.

This is a personal project, not related with or endorsed by [RSK](http://rsk.co).

## Installation

Via npm on Node:

```
npm install rskapi
```

## Usage

Create the RSK API Object by calling the host function.
```js
const rskapi = require('rskapi');

const client = rskapi.client('http://host.to.node.com:PORT');

/** operations with the node **/
```

Examples:
```js
const client = rskapi.client('http://localhost:8545') // ie ganache-client
// or
const client = rskapi.client('http://localhost:4444') // local rsk regtest
// or
const client = rskapi.client('https://public-node.testnet.rsk.co:443') // rsk testnet public node
// or
const client = rskapi.client('https://public-node.rsk.co:443') // rsk mainnet public node
```

## Client operations

Given a client object, it can be invoked using a callback or as promise:

```js
// get best block number

console.log(await client.number());  

// or

client.number(function (err, number) {
    if (err)
        console.log('error', err);
    else
        console.log(number);
});
```

In the following descriptions, a promise is used.

### Get best block number

```js
const number = await client.number();
```

### Get accounts

```js
const accounts = await client.accounts();
```

### Get account balance

```js
const balance = await client.balance(address);
```

### Get account nonce

```js
const nonce = await client.nonce(address);
```



## References

- [Web3 JavaScript app API](https://github.com/ethereum/wiki/wiki/JavaScript-API)
- [Web3 documentation](http://web3js.readthedocs.io/en/1.0/web3.html)
- [JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC)
- [How to generate Private key, public key and address](https://ethereum.stackexchange.com/questions/39384/how-to-generate-private-key-public-key-and-address)

## Samples

TBD

## Versions

- 0.0.1 initial version
- 0.0.2 callTransaction
- 0.0.3 fix duration encoding in unlock account
- 0.0.4 using simplejsonrpc 0.0.3
- 0.0.5 sending second argument in getBalance
- 0.0.6 sending transaction normalized data
- 0.0.7 exposing JSON RPC provider
- 0.0.8 using simplejsonrpc 0.0.4 with https support
- 0.0.9 send raw transaction
- 0.0.10 support async/await; using simplejsonrpc 0.0.6
- 0.0.11 new trace commands; get block using pending, latests, earlier
- 0.0.12 get logs; client with transfer, deploy, invoke, call, generate account

## Contribution

Feel free to [file issues](https://github.com/ajlopez/RskApi) and submit
[pull requests](https://github.com/ajlopez/RskApi/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

