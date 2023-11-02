"use client";
import { useState, useEffect } from "react";
import AskForCoffee from "./AskForCoffee";
// import { CreateRuntimeLifecycle } from "./CreateRuntimeLifecycle";
// import { WalletAPI } from "@marlowe.io/wallet";
// import { RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";

const runtimeServerURL = 'https://marlowe-runtime-preprod-web.demo.scdev.aws.iohkdev.io';

export default function Home() {
  const [runtimeLifecycle, setRuntimeLifecycle] = useState<null | any | string>(null); // RuntimeLifecycle>(null);

  useEffect(() => {
    async function run() {
      const { mkRuntimeLifecycle } = await import('@marlowe.io/runtime-lifecycle/browser');
      const runtimeLifecycle = await mkRuntimeLifecycle({ walletName: 'lace', runtimeURL: runtimeServerURL});
      setRuntimeLifecycle(runtimeLifecycle);
    }

    try {
      if(typeof window !== "undefined") {
        run();
      } else {
        console.log("On server, skipping wallet connection");
      }
    } catch (error) {
      setRuntimeLifecycle("Error: " + error);
    }
  }, []);


  if(runtimeLifecycle === null) {
    return "Connecting to wallet...";
  } else if(typeof runtimeLifecycle === "string") {
    return "Error: " + runtimeLifecycle;
  } else {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 max-w-5xl w-full font-mono lg:flex">
            <h1 className=" text-5xl">Marlowe workshop</h1>
            <p>
                Create the frontend of for the &quot;buy me a coffee&quot;
                request{" "}
            </p>
            <AskForCoffee runtimeLifecycle={runtimeLifecycle} />
        </main>
    );
    /* <CoffeesToFund runtimeLifecycle={runtimeLifecycle} /> */
  }
}
