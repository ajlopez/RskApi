# Simple Samples

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

## Get Block by Hash

Execute command:

```
node gettx <server> <hash>
```

The output is the transaction data in JSON format, null if it does not exist.

Example:

```
node gettx http://localhost:4444 0x10dde225116990b51234fbb2f888f554593e09ffc0805f470bf8dea2f0e26143
```

