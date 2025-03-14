import React from "react";
import AuthForm from "@/components/AuthForm";  // ✅ Fixed import path

export default function SignupPage() {
  return (
    <div>
      <AuthForm type="register" />
    </div>
  );
}
