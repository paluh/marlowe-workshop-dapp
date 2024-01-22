import React, { useRef, useState } from "react";
import { DAPP_TAG, mkContract } from "./Contract";
import { Address } from "@marlowe.io/language-core-v1";
import * as Contract from "@marlowe.io/runtime-rest-client/contract";
import { AddressBech32, TxId } from "@marlowe.io/runtime-core";
import { CreateContractRequest, RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";
import { FPTSRestAPI } from "@marlowe.io/runtime-rest-client";

type AskForCoffeeProps = {
  restAPI: FPTSRestAPI,
  runtimeLifecycle: RuntimeLifecycle
};

const addressFromBech32 = (addr: AddressBech32): Address => {
  return { address: addr };
}

const AskForCoffee: React.FC<AskForCoffeeProps> = ({ restAPI, runtimeLifecycle }) => {
    const [donorAddr, setDonorAddr] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<null | "submitting" | { contractId: any, txId: TxId } | { error: string }>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      setStatus("submitting");
      event.preventDefault();
      if(!inputRef.current) return;
      const coffeeBuyerAddr = { address: inputRef.current.value };

      const coffeeDrinkerAddr = await runtimeLifecycle.wallet.getChangeAddress();

      const contract = mkContract(
        coffeeBuyerAddr,
        addressFromBech32(coffeeDrinkerAddr)
      );
      var tags = { "buy-me-a-coffee": "" };
      const contractRequest:CreateContractRequest = {
        contract,
        tags,
      };

      const [contractId, txId] = await runtimeLifecycle.contracts.createContract(contractRequest);
      setStatus({ contractId, txId });
    };
    if(status === null) {
      return (
        <form onSubmit={handleSubmit}>
          <label>
              Barista (donnor):
              <input
                  type="text"
                  value={donorAddr}
                  onChange={(event) => setDonorAddr(event.target.value)}
                  ref={inputRef}
              />
          </label>
          <button type="submit">Order Coffee</button>
        </form>
      );
    } else if(typeof status === "string") {
      return <p>Submitting...</p>
    } else if("txId" in status) {
      return (
        <div>
          <p>Submitted! Transaction ID: {status.txId}</p>
          <button onClick={() => setStatus(null)}>Ok</button>
        </div>
      );
    } else {
      return (
        <div>
          <p>Error: {status.error}</p>
          // I want to reset the error
          <button onClick={() => setStatus(null)}>Ok</button>
        </div>
      );
    }
};

export default AskForCoffee;
