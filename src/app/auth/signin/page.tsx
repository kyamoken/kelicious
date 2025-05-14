"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">Kelicious ログイン</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        signIn("credentials", { email, password });
      }}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 w-full"
        >
          サインイン
        </button>
      </form>
    </div>
  );
}