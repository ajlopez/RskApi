# Simple Samples


## Get Accounts

Execute command:

```
node getaccounts <server>
```

The output is an array with the public address of the accounts that resides
in the node wallet. Usually to use with nodes like ganache or RSKJ regtest.
For security reasons, the node wallet (having the private keys of these accounts)
should be avoided in production or testnet nodes.

Example:

```
node getaccounts http://localhost:4444
```



## Get Number

Execute command:

```
node getnumber <server>
```

The output is the number of the best block in current blockchain.

Example:

```
node getnumber http://localhost:4444
```

## Get Block by Number

Execute command:

```
node getblock <server> <number>
```

The output is the block data in JSON format, null if it does not exist.

Example:

```
node getblock http://localhost:4444 63421
```

## Get Block by Hash

Execute command:

```
node getblockh <server> <hash>
```

The output is the block data in JSON format, null if it does not exist.

Example:

```
node getblockh http://localhost:4444 0xfa5b61b065c3d9cdd0772a03f9b644886faa10cf2030b0675667474b7cb09b3e
```

## Get Transaction by Hash

Execute command:

```
node gettx <server> <hash>
```

The output is the transaction data in JSON format, null if it does not exist.

Example:

```
node gettx http://localhost:4444 0x10dde225116990b51234fbb2f888f554593e09ffc0805f470bf8dea2f0e26143
```

## Get Transaction Receipt by Hash

Execute command:

```
node gettxr <server> <hash>
```

The output is the transaction receiptdata in JSON format, null if it does not exist.

Example:

```
node gettxr http://localhost:4444 0x10dde225116990b51234fbb2f888f554593e09ffc0805f470bf8dea2f0e26143
```

