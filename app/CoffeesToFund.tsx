import { RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";
import { DAPP_TAG } from "./Contract";
import { useEffect, useState } from "react";
import * as Contract from "@marlowe.io/runtime-rest-client/contract";
import { FPTSRestAPI } from "@marlowe.io/runtime-rest-client";
import { ContractId } from "@marlowe.io/runtime-core";
import { Environment, IDeposit, Input } from "@marlowe.io/language-core-v1";
import { Deposit, Next } from "@marlowe.io/language-core-v1/next";

type CoffeesToFundProps = {
  restAPI: FPTSRestAPI,
  runtimeLifecycle: RuntimeLifecycle
};

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

const POLLING_INTERVAL = 30000;

type DepositButtonProps = {
  runtimeLifecycle: RuntimeLifecycle,
  contractId: ContractId,
  deposit: IDeposit | null
}

const DepositButton:React.FC<DepositButtonProps> = ({ runtimeLifecycle, contractId, deposit }) => {
  // ApplyInputsRequest: {
  //     inputs: Input[];
  //     invalidBefore?: ISO8601;
  //     invalidHereafter?: ISO8601;
  //     metadata?: Metadata;
  //     tags?: Tags;
  // }
  const [submitted, setSubmitted] = useState<boolean | string>(false);
  // We want to display button to deposit if there is no deposit
  if(deposit) {
    if(!submitted) {
      const go = async function() {
        const inputs: Input[] = [deposit]
        const depositRequest = {
          inputs: inputs
        };
        const res = await runtimeLifecycle.contracts.applyInputs(contractId, depositRequest)
        setSubmitted(true)
      }
      return <button onClick={() => go()}>Deposit</button>
    } else {
      return <span>Deposited</span>
    }
  } else {
    return <span>Already funded</span>
  }
}

type ContractInfo = {
  contractHeader: Contract.ContractHeader,
  deposit: IDeposit | null
}

export const CoffeesToFund: React.FC<CoffeesToFundProps> = ({ restAPI, runtimeLifecycle }) => {
  const [contractHeaders, setContractHeaders] = useState<ContractInfo[]>([]);
  useEffect(() => {
    const shouldUpdateRef = { current: true };
    const updateContracts = async () => {
      const walletAddresses = await runtimeLifecycle.wallet.getUsedAddresses();
      const changeAddress = await runtimeLifecycle.wallet.getChangeAddress();
      walletAddresses.push(changeAddress);
      const allAddresses = new Set(walletAddresses);

      const contractsRequest: Contract.GetContractsRequest = {
        tags: [ DAPP_TAG ],
        partyAddresses: [...allAddresses]
      };
      // FETCH CONTRACTS: Please replace the below value with `await` based call to the rest client.
      // which should return a list of contracts that are tagged with `DAPP_TAG` and are relevant to the user.
      const contractHeaders:{ headers: Contract.ContractHeader[] } = await (new Promise((resolve) => { headers: [] }));

      const contractInfos = await Promise.all(contractHeaders.headers.map(async (contractHeader: Contract.ContractHeader) => {
        const now = Date.now();
        const tenMinutesInMilliseconds = 10 * 60 * 1000;
        const inTenMinutes = now + tenMinutesInMilliseconds;
        const env = { timeInterval: { from: now, to: inTenMinutes } };

        // APPLIABLE INPUTS: Please replace the below value with `await` based call to the lifecycle API.
        const response:Next = await (new Promise((resolve) => { applicable_inputs: { deposits: [] } }));

        if(response.applicable_inputs.deposits.length > 0) {
          const depositInfo = response.applicable_inputs.deposits[0];
          return { contractHeader, deposit: Deposit.toInput(depositInfo)}
        } else {
          return { contractHeader, deposit: null, deposited: true}
        }
      }));
      setContractHeaders(contractInfos);
      await delay(POLLING_INTERVAL);
      if (shouldUpdateRef.current) { updateContracts() };
    };
    updateContracts();
    return () => {
      shouldUpdateRef.current = false;
    };
  }, []);

  if(contractHeaders.length === 0) {
    return <p>No coffees to fund</p>
  } else {
    return (
    <ul>
      {contractHeaders.map(({ contractHeader, deposit}, index) => (
        <li key={index}>{ contractHeader.contractId } | <DepositButton runtimeLifecycle={runtimeLifecycle} contractId={contractHeader.contractId} deposit={deposit} /></li>
      ))}
    </ul>
    );
  };
}


