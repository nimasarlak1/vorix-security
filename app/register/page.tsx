"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { users } from "@/lib/users";


export default function RegisterPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleRegister = () => {

    if (!name || !email || !password) {
      alert("لطفا همه موارد را وارد کنید");
      return;
    }


    users.push({
      name,
      email,
      password,
      role: "customer"
    });


    alert("ثبت نام با موفقیت انجام شد");


    router.push("/login");

  };


  return (

    <main className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md p-8 border rounded-xl">


        <h1 className="text-2xl mb-6 text-center">
          ثبت نام مشتری
        </h1>


        <input
          className="border p-3 w-full mb-3"
          placeholder="نام شرکت یا نام شما"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />


        <input
          className="border p-3 w-full mb-3"
          placeholder="ایمیل"
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />


        <input
          className="border p-3 w-full mb-3"
          placeholder="رمز عبور"
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />


        <button
          onClick={handleRegister}
          className="bg-black text-white w-full p-3 rounded"
        >
          ثبت نام
        </button>


      </div>

    </main>

  );

}
