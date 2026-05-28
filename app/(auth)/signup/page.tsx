"use client";

import { SignupFormSheet } from "@/components/auth/SignupFormSheet";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  return (
    <SignupFormSheet
      onSwitchToLogin={() => router.push(`/login${window.location.search}`)}
    />
  );
}
