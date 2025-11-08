"use client";
import { useNeynarContext } from "@neynar/react";

export default function LoginButton() {
  const { user, loginWithSigner, logout } = useNeynarContext();

  if (user) {
    return (
      <div>
        <p>Logged in as FID: {user.fid}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <button
      onClick={() =>
        loginWithSigner({
          successUrl: window.location.href,
          cancelUrl: window.location.href,
        })
      }
    >
      Login with Farcaster
    </button>
  );
}
