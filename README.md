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

### Get transaction

```js
const tx = await client.transaction(hash);
```

### Get transaction receipt

```js
const tx = await client.receipt(hash, nseconds);
```

where `nseconds` is the number of seconds to try (one request per second). If zero,
it waits forever.

### Transfer

```js
const txhash = await client.transfer(sender, receiver, value, options);
```

`sender` and `receiver` are accounts, represented by their public address, or
by an object with `address` and `privateKey` properties.

`options` is an object with properties like `gas`, `gasPrice` and `nonce`.

If no nonce is provided, the next nonce available for the sender will be use.

If no gas price is provided, the one informed by the host will be used.

### Deploy contract

```js
const txhash = await client.deploy(sender, bytecodes, args, options);
```
`sender` is an account (an address or an object with properties `address` and `privateKey`).

`bytecodes` is an hexadecimal string starting with `0x`.

`args` is an array with the constructor arguments. It could be `null`.

`options` is an object with properties like `gas`, `gasPrice`, `value` and `nonce`.

If no nonce is provided, the next nonce available for the sender will be use.

If no gas price is provided, the one informed by the host will be used.

### Invoke contract

```js
const txhash = await client.invoke(sender, receiver, fn, args, options);
```
`sender` is an account (an address or an object with properties `address` and `privateKey`).

`receiver` is the address of a contract already deployed.

`fn` is an string with the full function signature to invoke, ie `transfer(address,uint256)`.

`args` is an array with the function arguments.

`options` is an object with properties like `gas`, `gasPrice`, `value` and `nonce`.

If no nonce is provided, the next nonce available for the sender will be use.

If no gas price is provided, the one informed by the host will be used.

### Call contract

```js
const txhash = await client.call(sender, receiver, fn, args, options);
```
`sender` is an account (an address or an object with properties `address` and `privateKey`).

`receiver` is the address of a contract already deployed.

`fn` is an string with the full function signature to invoke, ie `transfer(address,uint256)`.

`args` is an array with the function arguments.

`options` is an object with properties like `value`.

Being a call query and not a transaction, no `gasPrice`, `gas` or `nonce` is
needed.

## References

- [Web3 JavaScript app API](https://github.com/ethereum/wiki/wiki/JavaScript-API)
- [Web3 documentation](http://web3js.readthedocs.io/en/1.0/web3.html)
- [JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC)
- [How to generate Private key, public key and address](https://ethereum.stackexchange.com/questions/39384/how-to-generate-private-key-public-key-and-address)

## Samples

Some simple samples at https://github.com/ajlopez/RskApi/tree/master/samples/simple.

Some simple commands using a configuration file at https://github.com/ajlopez/RskApi/tree/master/samples/commands.

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
- 0.0.13 first utils; get nonce using pending
- 0.0.14 client get storage, get peer list, get peer count, get scoring list, format addresses and values
- 0.0.15 improved `client.block`, get balance using block, get nonce using block, encode big integers

## Posts

- [A library and commands to interact with RSK and Ethereum nodes](https://medium.com/@angeljavalopez/a-library-and-commands-to-interact-with-rsk-and-ethereum-nodes-cff644659598) [markdown version](https://github.com/ajlopez/RskApi/blob/master/post.md)

## Contribution

Feel free to [file issues](https://github.com/ajlopez/RskApi) and submit
[pull requests](https://github.com/ajlopez/RskApi/pulls) — contributions are
welcome.

If you submit a pull request, please be sure to add or update corresponding
test cases, and ensure that `npm test` continues to pass.

