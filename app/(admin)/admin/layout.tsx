import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration — Mandibula",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-background text-foreground">{children}</div>;
}
