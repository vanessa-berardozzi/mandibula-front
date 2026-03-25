"use client";

import { AuthPanel } from "@/components/auth/AuthPanel";
import { SignupFormSheet } from "@/components/auth/SignupFormSheet";
import { useRouter } from "next/navigation";

export default function SignupModal() {
  const router = useRouter();

  return (
    <AuthPanel>
      <SignupFormSheet onSwitchToLogin={() => router.push("/login")} />
    </AuthPanel>
  );
}
