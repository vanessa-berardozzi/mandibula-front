"use client";

import { LoginFormSheet } from "@/components/auth/LoginFormSheet";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginFormSheet
      onSwitchToSignup={() => router.push(`/signup${window.location.search}`)}
    />
  );
}
