import { Address, Contract, datetoTimeout } from "@marlowe.io/language-core-v1";
import { lovelace } from "@marlowe.io/language-core-v1/playground-v1";

export const DAPP_TAG = "buy-me-a-coffee";

export const mkContract = (buyer: Address, coffeeDrinker: Address): Contract => {
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  const inTwentyFourHours = datetoTimeout(new Date(Date.now() + twentyFourHoursInMilliseconds));

  const c:Contract = {
      "when": [
        {
          "then": "close",
          "case": {
            party: buyer,
            deposits: 1n,
            of_token: lovelace,
            into_account: coffeeDrinker
          }
        }
      ],
      timeout_continuation: "close",
      timeout: inTwentyFourHours
  };
  return c;
};


