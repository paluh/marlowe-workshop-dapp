import { WalletAPI } from "@marlowe.io/wallet";
import React, { useRef, useState } from "react";
import { mkContract } from "./Contract";
import { Address } from "@marlowe.io/language-core-v1";
import { AddressBech32, unAddressBech32 } from "@marlowe.io/runtime-core";
import { RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";

type AppTag = "marlowe-workshop-ask-for-coffee";

type AskForCoffeeProps = {
  runtimeLifecycle: RuntimeLifecycle
};

const addressFromBech32 = (addr: AddressBech32): Address => {
  return { address: unAddressBech32(addr) };
}

const AskForCoffee: React.FC<AskForCoffeeProps> = ({ runtimeLifecycle }) => {
    const [donorAddr, setDonorAddr] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<null | "submitting" | { txId: string } | { error: string }>(null);

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
      // CreateContractRequest: {
      //     contract: Contract;
      //     metadata?: Metadata;
      //     minUTxODeposit?: number;
      //     roles?: RolesConfig;
      //     tags?: Tags;
      // }
      const [contractId, txId] = await runtimeLifecycle.contracts.createContract({ contract, tags: { appTag: "" } });
      setStatus({ txId });
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
