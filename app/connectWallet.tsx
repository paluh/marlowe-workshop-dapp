import React, { useState, useEffect } from 'react';
import {
  mkBrowserWallet,
  getInstalledWalletExtensions,
  WalletAPI,
} from "@marlowe.io/wallet";

type WalletState =
  | { tag: "connecting" }
  | { tag: "connection-failed"; error: any }
  | { tag: "connection-succeeded"; wallet: any };

const WalletComponent = (onSuccess: (wallet: WalletAPI) => void) => {
  const [state, setState] = useState<WalletState>({ tag: "connecting" });

  useEffect(() => {
    async function connectWallet() {
      try {
        const walletExtensions = getInstalledWalletExtensions();
        console.log(`Available Browser Wallet Extensions: ${walletExtensions}`);

        // If no Lace is found we can't proceed - you can change this to `nami | eternl`
        const laceIsPresent = walletExtensions.some(w => w.name === 'lace');
        if (!laceIsPresent) {
          setState({ tag: "connection-failed", error: new Error("Lace not found") });
          return;
        }
        const wallet = await mkBrowserWallet('lace');
        onSuccess(wallet);

      } catch (error) {
        setState({ tag: "connection-failed", error: error });
      }
    }
    connectWallet();
  }, []);

  return (
    <div>
      {state.tag === "connecting" && <p>Connecting to Lace...</p>}
      {state.tag === "connection-failed" && <p>Error: {state.error.message}</p>}
      {state.tag === "connection-succeeded" && <p>Connected to wallet!</p>}
    </div>
  );
};

export default WalletComponent;

