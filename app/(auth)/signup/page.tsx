"use client";

import { SignupFormSheet } from "@/components/auth/SignupFormSheet";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-sidebar backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignupFormSheet
          onSuccess={() => router.push("/")}
          onSwitchToLogin={() => router.push("/login")}
        />
      </div>
    </div>
  );
}
