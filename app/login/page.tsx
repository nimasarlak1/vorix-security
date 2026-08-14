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
      <div>
        <h1 className="text-3xl mb-5">ورود</h1>

        <input
          className="border p-2 m-1"
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 m-1"
          placeholder="رمز عبور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="border p-2 m-1"
          onClick={handleLogin}
        >
          ورود
        </button>

        <p>{message}</p>
      </div>
    </main>
  );
}
