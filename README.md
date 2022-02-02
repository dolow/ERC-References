# What is this ?

Reference implementation of major ERCs.

# Instruction

## Prerequisites (Local environment)

### Install geth

```
% brew tap ethereum/ethereum
% brew install ethereum
```

### Launch local testnet

```
% geth --networkid 10 --allow-insecure-unlock --nodiscover -datadir ./eth_private_net/ --http --dev
```

### Faucet local testnet ETH

Launch geth console

```
% geth --networkid 10 --allow-insecure-unlock --nodiscover -datadir ./eth_private_net/ --http --dev console
```

```
> eth.sendTransaction({from: eth.coinbase, to: <address>, value: web3.toWei(amount, "ether")});
```

## ERC20

Serve `front/erc20.html` somehow.

e.g)

```
% npm i --save-dev live-server
% npx live-server ./front
```

# LICENSE

MIT
