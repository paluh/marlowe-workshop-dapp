"use client";
import { use } from "react";
import AskForCoffee from "./askForCoffee";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 max-w-5xl w-full font-mono lg:flex">
            <h1 className=" text-5xl">Marlowe workshop -</h1>
            <p>
                Create the frontend of for the &quot;buy me a coffee&quot;
                request{" "}
            </p>
            <AskForCoffee />
        </main>
    );
}
