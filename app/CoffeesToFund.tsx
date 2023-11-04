import { RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";
import { DAPP_TAG } from "./Contract";
import { useEffect, useState } from "react";
import { ContractHeader, GetContractsRequest } from "@marlowe.io/runtime-rest-client/contract/index";
import { RestAPI } from "@marlowe.io/runtime-rest-client";
import { unContractId } from "@marlowe.io/runtime-core";

type CoffeesToFundProps = {
  restAPI: RestAPI,
  runtimeLifecycle: RuntimeLifecycle
};

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

const POLLING_INTERVAL = 30000;

export const CoffeesToFund: React.FC<CoffeesToFundProps> = ({ restAPI, runtimeLifecycle }) => {
  const [contractHeaders, setContractHeaders] = useState<ContractHeader[]>([]);
  useEffect(() => {
    const shouldUpdateRef = { current: true };
    const updateContracts = async () => {
      const walletAddresses = await runtimeLifecycle.wallet.getUsedAddresses();
      const changeAddress = await runtimeLifecycle.wallet.getChangeAddress();
      walletAddresses.push(changeAddress);
      const allAddresses = new Set(walletAddresses);

      const contractsRequest: GetContractsRequest = {
        tags: [ DAPP_TAG ],
        partyAddresses: [...allAddresses]
      };
      // TODO: we should provide pagination here (API is paginated)
      const contractHeaders = await restAPI.getContracts(contractsRequest);
      // const contracts = await Promise.all(contractHeaders.headers.map(async (contractHeader:ContractHeader) => {
      //   await restAPI.getContract(contractHeader.contractId);
      // }));

      setContractHeaders(contractHeaders.headers);
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
      {contractHeaders.map((contractHeader, index) => (
        <li key={index}>{unContractId(contractHeader.contractId)}</li>
      ))}
    </ul>
    );
  };
}


