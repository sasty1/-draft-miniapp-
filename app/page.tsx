"use client";

import { useState } from "react";
import { useNeynarContext } from "@neynar/react";
import LoginButton from "./components/LoginButton";

export default function Home() {
  const { user } = useNeynarContext();
  const [text, setText] = useState("");

  const sendCast = async () => {
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        signer_uuid: user.signer_uuid, // user’s own signer from login
      }),
    });
    const data = await res.json();
    alert(data.success ? "Cast sent ✅" : "❌ " + data.error);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>Farcaster Mini App</h1>
      <LoginButton />

      {user && (
        <div style={{ marginTop: 20 }}>
          <textarea
            placeholder="Write something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <br />
          <button onClick={sendCast}>Send Cast</button>
        </div>
      )}
    </main>
  );
}
