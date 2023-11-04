"use client";
import { useState, useEffect } from "react";
import AskForCoffee from "./AskForCoffee";
import { mkRestClient } from "@marlowe.io/runtime-rest-client";
import { RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";
import { CoffeesToFund } from "./CoffeesToFund";

const runtimeServerURL = 'https://marlowe-runtime-preprod-web.demo.scdev.aws.iohkdev.io';
const restAPI = mkRestClient(runtimeServerURL);

export default function Home() {
  const [runtimeLifecycle, setRuntimeLifecycle] = useState<null | RuntimeLifecycle | string>(null)

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
      "Error: " + runtimeLifecycle;
  } else {
    return (
        <main className="container">
            <h1 className="">Marlowe workshop</h1>
            <p>
                Create the frontend of for the &quot;buy me a coffee&quot;
                request{" "}
            </p>
            <AskForCoffee runtimeLifecycle={runtimeLifecycle} restAPI={restAPI} />
            <CoffeesToFund runtimeLifecycle={runtimeLifecycle} restAPI={restAPI} />
        </main>
    );
  }
}
