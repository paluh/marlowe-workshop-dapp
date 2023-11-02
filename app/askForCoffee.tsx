import React, { useState } from "react";

const AskForCoffee = () => {
    const [donorAddr, setDonorAddr] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO: create transaction
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Barista (donnor):
                <input
                    type="text"
                    value={donorAddr}
                    onChange={(event) => setDonorAddr(event.target.value)}
                />
            </label>
            <button type="submit">Order Coffee</button>
        </form>
    );
};

export default AskForCoffee;
