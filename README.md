## marlowe-worshop-dapp

### The Exercise

Slides can be found here: [./public/slides.pdf](./public/slides.pdf).

We want to implement a simple application which could perform "Buy Me a Coffee" exercise flow.

## Hacking Flow

### Static contract design

* Please start in blockly: [play.marlowe.iohk.io](https://play.marlowe.iohk.io)

* Please design the contract.

### Dynamic contract buildup

* When contract is finished "Send to Simulator" (top-right corner) button should be active.

* Then click "Download JSON" button.

* We will be using marlowe-ts-sdk which provides types for language construct encoding: https://input-output-hk.github.io/marlowe-ts-sdk/modules/_marlowe_io_language_core_v1.index.html

* Now we can jump into the [./app/Contract.ts](./app/Contract.ts) and try to use the JSON which you just downloaded.

* Let's try to make the contract "dynamic".

### Fetch address from wallet

* For wallet interaction we want to use [language package from TS-SDK](https://input-output-hk.github.io/marlowe-ts-sdk/interfaces/_marlowe_io_wallet.api.WalletAPI.html)

* It is thin wrapper around: https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030

* Please jump into [./app/AskForCoffee.tsx] and search for `WALLET INTERACTION` string.

* Try to grab the address there.


### Create Marlowe contract

* We will be using Marlowe Runtime REST API: https://docs.marlowe.iohk.io/docs/developer-tools/runtime/marlowe-runtime

* The API docs can be found here: https://docs.marlowe.iohk.io/api/get-contracts.

* Please jump into [./app/AskForCoffee.tsx] and search for `CREATE CONTRACT` string.

* Try to dynamically create the contract (you have a helper in `Contract.ts` ;-)) and implement submission.

* During testing you can try to use your own address and check if the contract is on the chain in our simple Runner dapp: https://runner-preprod.scdev.aws.iohkdev.io/


### List existing contracts

* The API docs can be found here: https://docs.marlowe.iohk.io/api/get-contracts.


