import { redirect } from "next/navigation";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { getSession, roleHomePath } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();
  if (session) {
    redirect(roleHomePath(session.role));
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <LandingNav />
      <main id="main-content">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <AudienceSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
