import AuthForm from "@/components/AuthForm";

export default function AgentSignupPage() {
  return (
    <div>
      <AuthForm type="register" userType="agent" />
    </div>
  );
}