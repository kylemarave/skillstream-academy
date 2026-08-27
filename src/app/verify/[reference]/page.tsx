import Link from "next/link";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { CertificateRecord } from "@/components/certificate/CertificateRecord";
import { VerifyForm } from "@/components/certificate/VerifyForm";
import { getPublicCertificate } from "@/lib/db";
import { normalizeReference } from "@/lib/certificates";

type PageProps = { params: Promise<{ reference: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { reference } = await params;
  const record = await getPublicCertificate(decodeURIComponent(reference));
  if (!record) {
    return { title: "Certificate not found" };
  }
  return { title: `Certificate ${record.certificate.referenceNumber}` };
}

export default async function VerifyCertificatePage({ params }: PageProps) {
  const { reference } = await params;
  const lookup = normalizeReference(decodeURIComponent(reference));
  const record = await getPublicCertificate(lookup);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <LandingNav />
      <main
        id="main-content"
        className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-7 lg:py-16"
      >
        {record ? (
          <>
            <p className="eyebrow">Public verification</p>
            <h1 className="page-title mt-3">
              {record.certificate.verificationStatus === "revoked"
                ? "This certificate was revoked"
                : "Certificate verified"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              This record was issued by Skillstream Academy. No PDF file is
              stored in this prototype — the reference is the credential.
            </p>
            <div className="mt-8">
              <CertificateRecord
                studentName={record.studentName}
                courseTitle={record.courseTitle}
                issuedAt={record.issuedAt}
                referenceNumber={record.certificate.referenceNumber}
                status={record.certificate.verificationStatus}
              />
            </div>
          </>
        ) : (
          <>
            <p className="eyebrow">Public verification</p>
            <h1 className="page-title mt-3">No matching certificate</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Nothing in the registry matches that reference. Check the
              characters and try again.
            </p>
          </>
        )}

        <div className="card mt-8 px-5 py-6">
          <p className="section-title">Check another</p>
          <div className="mt-4">
            <VerifyForm
              defaultValue={lookup}
              error={
                record
                  ? undefined
                  : "No certificate matches that reference."
              }
            />
          </div>
        </div>

        <p className="mt-6 text-sm text-muted">
          <Link href="/" className="font-medium text-brand hover:text-brand-strong">
            Back to home
          </Link>
        </p>
      </main>
      <LandingFooter />
    </div>
  );
}
