"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { users } from "@/lib/users";


export default function LoginPage() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");


  const handleLogin = () => {

    const user = users.find(
      (u)=> 
        u.email === email &&
        u.password === password
    );


    if(!user){
      setMessage("ایمیل یا رمز عبور اشتباه است");
      return;
    }


    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );


    if(user.role === "admin"){

      router.push("/dashboard");

    }else{

      router.push("/customer");

    }

  };


  return (

    <main className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md p-8 border rounded-xl">


        <h1 className="text-2xl mb-6 text-center">
          ورود
        </h1>


        <input
          className="border p-3 w-full mb-3"
          placeholder="ایمیل"
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
          onClick={handleLogin}
          className="bg-black text-white w-full p-3 rounded"
        >
          ورود
        </button>
<p className="text-center mt-4">
  حساب ندارید؟{" "}
  <a href="/register" className="text-blue-600 underline">
    ثبت نام مشتری
  </a>
</p>

        {
          message &&
          <p className="mt-4">
            {message}
          </p>
        }


      </div>

    </main>

  );

}
