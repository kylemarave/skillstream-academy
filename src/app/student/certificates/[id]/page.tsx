import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CertificateRecord } from "@/components/certificate/CertificateRecord";
import { CopyReferenceButton } from "@/components/certificate/CopyReferenceButton";
import { requireRole } from "@/lib/auth";
import { getStudentCertificate } from "@/lib/db";
import { studentNav } from "@/lib/nav";

type PageProps = { params: Promise<{ id: string }> };

export default async function StudentCertificateDetailPage({
  params,
}: PageProps) {
  const session = await requireRole(["student"]);
  const { id } = await params;
  const record = await getStudentCertificate(session.id, id);

  if (!record) {
    notFound();
  }

  const { certificate, course } = record;
  const studentName = `${session.firstName} ${session.lastName}`;

  return (
    <AppShell
      user={session}
      title={course.title}
      subtitle="Share the reference number. Anyone can confirm this credential without signing in."
      nav={studentNav}
      actions={
        <Link href="/student/certificates" className="btn btn-secondary">
          <ArrowLeft aria-hidden="true" size={16} />
          All certificates
        </Link>
      }
    >
      <div className="space-y-6">
        <CertificateRecord
          studentName={studentName}
          courseTitle={course.title}
          issuedAt={certificate.issuedAt}
          referenceNumber={certificate.referenceNumber}
          status={certificate.verificationStatus}
        />

        <section className="card px-5 py-5">
          <p className="section-title">Share and verify</p>
          <p className="mt-1 text-sm text-muted">
            This prototype does not store a PDF. The public page is the
            verifiable record.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyReferenceButton referenceNumber={certificate.referenceNumber} />
            <Link
              href={certificate.fileUrl}
              className="btn btn-primary"
            >
              Open public verification
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
