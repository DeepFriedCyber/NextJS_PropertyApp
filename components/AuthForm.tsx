'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";

interface AuthFormProps {
  type: 'login' | 'register';
  userType?: 'individual' | 'agent';
}

export default function AuthForm({ type, userType }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (type === 'login') {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: "/"
        });
        
        if (result?.error) {
          setError("Invalid credentials");
        }
      } else {
        // Registration logic
        const userData = {
          email,
          password,
          userType,
          ...(userType === 'agent' && {
            companyName,
            licenseNumber,
          }),
        };

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Registration failed');
        }

        // After successful registration, sign in
        await signIn("credentials", {
          email,
          password,
          redirect: true,
          callbackUrl: "/"
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6">
        {type === 'login' ? 'Sign In' : `Sign Up as ${userType === 'agent' ? 'Estate Agent' : 'Individual'}`}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded"
        required
      />

      {type === 'register' && userType === 'agent' && (
        <>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="License Number"
            className="w-full p-2 mb-4 border rounded"
            required
          />
        </>
      )}
      
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {type === 'login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
}
