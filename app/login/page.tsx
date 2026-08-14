"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setMessage("لطفا ایمیل و رمز عبور را وارد کنید");
     function handleLogin() {
  if (!email || !password) {
    setMessage("لطفا ایمیل و رمز عبور را وارد کنید");
    return;
  }

  setMessage("ورود انجام شد");
}
      return
    }

    setMessage("ورود انجام شد");
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h1 className="text-3xl mb-6">
          ورود
        </h1>

        <input
          className="border p-2 w-full mb-3"
          type="email"
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="border px-4 py-2"
          onClick={handleLogin}
        >
          ورود
        </button>

        {message && (
          <p className="mt-4">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
