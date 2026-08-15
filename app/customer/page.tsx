"use client";

import { useEffect, useState } from "react";

export default function CustomerPage() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("user");

    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);


  return (
    <main className="min-h-screen flex items-center justify-center">

      <div className="w-full max-w-md p-8 border rounded-xl">

        <h1 className="text-2xl mb-6 text-center">
          پنل مشتری
        </h1>


        {user && (
          <div>
            <p>
              نام: {user.name}
            </p>

            <p>
              ایمیل: {user.email}
            </p>

            <p>
              نوع حساب: مشتری
            </p>
          </div>
        )}

      </div>

    </main>
  );
}
