'use client';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Protected Page</h1>
      <p>Welcome {user?.email}</p>
    </div>
  );
}