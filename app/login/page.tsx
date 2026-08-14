"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleLogin() {
    if (!email || !password) {
      setMessage("لطفا ایمیل و رمز عبور را وارد کنید");
      return;
    }

    setMessage("ورود انجام شد");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-8 border rounded-lg">
        <h1 className="text-2xl font-bold mb-4">
          ورود
        </h1>

        <input
          className="border p-2 mb-3 block"
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 mb-3 block"
          placeholder="رمز عبور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={handleLogin}
        >
          ورود
        </button>

        <p>{message}</p>
      </div>
    </main>
  );
}
