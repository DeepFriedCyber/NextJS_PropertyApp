"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    if (type === "register") {
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      alert("Account created! Please log in.");
    } else {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) alert(res.error);
      else window.location.href = "/";
    }
  };

  return (
    <div className="p-4 border">
      <h2 className="text-lg font-bold">{type === "register" ? "Sign Up" : "Log In"}</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full mt-2" />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full mt-2" />
      <button onClick={handleAuth} className="bg-blue-500 text-white px-4 py-2 mt-4 w-full">
        {type === "register" ? "Sign Up" : "Log In"}
      </button>
    </div>
  );
}
