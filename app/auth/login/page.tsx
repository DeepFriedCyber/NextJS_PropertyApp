import React from "react";
import AuthForm from "@/components/AuthForm";  // ✅ Fixed import path

export default function LoginPage() {
  return (
    <div>
      <AuthForm type="login" />
    </div>
  );
}
