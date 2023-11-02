import { Address, Contract, datetoTimeout } from "@marlowe.io/language-core-v1";
import { lovelace } from "@marlowe.io/language-core-v1/playground-v1";

export const mkContract = (donor: Address, acceptor: Address): Contract => {
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
  const inTwentyFourHours = datetoTimeout(new Date(Date.now() + twentyFourHoursInMilliseconds));

  return {
      "when": [
        {
          "then": "close",
          "case": {
            party: donor,
            deposits: 1n,
            of_token: lovelace,
            into_account: acceptor
          }
        }
      ],
      timeout_continuation: "close",
      timeout: inTwentyFourHours
  };
};


