import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { VerifyForm } from "@/components/certificate/VerifyForm";

export default function VerifyIndexPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <LandingNav />
      <main
        id="main-content"
        className="mx-auto w-full max-w-lg px-5 py-12 sm:px-7 lg:py-16"
      >
        <h1 className="page-title">Verify a certificate</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Enter the reference number from a Skillstream Academy certificate.
          Anyone can check it — you do not need an account.
        </p>
        <div className="card mt-8 px-5 py-6">
          <VerifyForm />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
