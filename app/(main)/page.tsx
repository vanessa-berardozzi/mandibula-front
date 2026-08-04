"use client";

import {
    AboutSection,
    FeaturedSelection,
    JungleManifesto,
    MissionSection,
    PacksSection,
    SignalTicker,
} from "@/components/features/Home";
import { HeroSection } from "@/components/features/Home/HeroSection/HeroSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full">
      <HeroSection />
      <SignalTicker />
      <FeaturedSelection />
      <PacksSection />
      <AboutSection />
      <JungleManifesto />
      <MissionSection />
    </main>
  );
}

