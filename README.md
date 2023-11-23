## marlowe-worshop-dapp

### The Exercise

We want to implement a simple application which could perform "Buy Me a Coffee" exercise flow. The contract is described on pages 14 and 15 here: [./public/slides.pdf](./public/slides.pdf).

We want to implement a simple application which provides a single UX for both sides coffee sponsors and coffee drinkers:

* Coffee drinker flow:
    * Connect wallet and fetch the address from it. We will call it "coffee drikner address".
    * Accept an address from the user - user can pick a person ("buyer") who should buy a coffee ;-)
    * We want to dynamically create Marlowe deposit contract
    * This deposit contract should uses "buyer" as a sender and "coffee drinker" as a receipient
    * It should expire in 24h (we should dynamically adjust the timeout).
    * Then we want to submit this contract to the chain.

* Coffee sponsor flow:
    * We will use the same connection and the same address but in this context we want to find contracts which use
    that address as a sender.
    * We want to list all the request to a given wallet.
    * We want to provide a way to perform a deposit and finalize the contract.

## Hacking Flow

### Static contract design

* Please start in the Blockly: [play.marlowe.iohk.io](https://play.marlowe.iohk.io)

* Please design the deposit contract and put arbitrary addresses for recipient and the sender.

### Dynamic contract buildup

* Now Let's download the code from this repo to your local machine and perform stanard `npm install`.

* When contract is finished click the "Send to Simulator" - this top-right corner button should be active.

* Then click "Download JSON" button.

* We will be using marlowe-ts-sdk which provides types for language construct encoding: https://input-output-hk.github.io/marlowe-ts-sdk/modules/_marlowe_io_language_core_v1.index.html

* Now we can jump into the [./app/Contract.ts](./app/Contract.ts) and try to use the JSON which you just downloaded.

* One minor pitfall of `JSON` in JavaScript is that it is not able to handle correctly big integeres (by default it parses integer as a number)
  so we have to add `n` suffix to every integer in the JSON (like `1000n`).

* Now let's try to make the contract "dynamic" as described in the exercises section above.

### Fetch address from wallet

* For wallet interaction we want to use [language package from TS-SDK](https://input-output-hk.github.io/marlowe-ts-sdk/interfaces/_marlowe_io_wallet.api.WalletAPI.html)

* It is thin wrapper around: https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030.

* Please jump into [./app/AskForCoffee.tsx](AskForCoffee.tsx) and search for `WALLET INTERACTION` string.

* Try to grab the address there.


### Submit Marlowe contract

* We will be using Marlowe Runtime REST API: https://docs.marlowe.iohk.io/docs/developer-tools/runtime/marlowe-runtime

* The API docs can be found here: https://docs.marlowe.iohk.io/api/get-contracts.

* Please jump into [./app/AskForCoffee.tsx](./app/AskForCoffee.tsx) and search for `CREATE CONTRACT` string.

* Try to dynamically create the contract (you have a helper in `Contract.ts` ;-)) and implement submission.

* During testing you can try to use your own address and check if the contract is on the chain in our simple Runner dapp: https://runner-preprod.scdev.aws.iohkdev.io/


### List existing contracts

* To list the contracts which request a coffee donation for a given wallet we want to use rest client.

* The API docs can be found here: https://docs.marlowe.iohk.io/api/get-contracts.

* We want to use this endpoint to fetch the contracts in which the connected wallet takes a role of the Buyer. Please check filtering options of the API.

* Let's jump into [./app/CoffeesToFund.tsx](./app/CoffeesToFund.tsx) and search for string `FETCH CONTRACTS` in it.

* `APPLICABLE INPUTS`
