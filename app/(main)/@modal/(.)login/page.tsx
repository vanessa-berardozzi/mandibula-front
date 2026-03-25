"use client";

import { AuthPanel } from "@/components/auth/AuthPanel";
import { LoginFormSheet } from "@/components/auth/LoginFormSheet";
import { useRouter } from "next/navigation";

export default function LoginModal() {
  const router = useRouter();

  return (
    <AuthPanel>
      <LoginFormSheet onSwitchToSignup={() => router.push("/signup")} />
    </AuthPanel>
  );
}
