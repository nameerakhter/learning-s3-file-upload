"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <button
        onClick={() => signIn("github")}
        className="bg-white text-black p-4 font-bold  rounded-xl"
      >
        SignIn
      </button>
    );
  } else {
    return (
      <button
        onClick={() => signOut()}
        className="bg-white text-black p-4 font-bold  rounded-xl"
      >
        SignOut
      </button>
    );
  }
  return (
    <>
      <h1>User SignIn/LoginPage</h1>;
    </>
  );
}
