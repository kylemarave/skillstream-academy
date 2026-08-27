import type { CertificateVerificationStatus } from "@/lib/types";
import { formatIssuedDate } from "@/lib/certificates";

export function CertificateRecord({
  studentName,
  courseTitle,
  issuedAt,
  referenceNumber,
  status,
}: {
  studentName: string;
  courseTitle: string;
  issuedAt: string;
  referenceNumber: string;
  status: CertificateVerificationStatus;
}) {
  const revoked = status === "revoked";

  return (
    <article
      className={`overflow-hidden rounded-[10px] border ${
        revoked
          ? "border-line bg-subtle"
          : "border-success/30 bg-surface"
      }`}
    >
      <div
        className={`h-1.5 ${revoked ? "bg-line-strong" : "bg-success"}`}
        aria-hidden="true"
      />
      <div className="px-6 py-8 sm:px-8">
        <p className="eyebrow">Skillstream Academy</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
          Certificate of completion
        </h2>
        <p className="mt-6 text-sm text-muted">This certifies that</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{studentName}</p>
        <p className="mt-5 text-sm text-muted">has completed</p>
        <p className="mt-1 text-lg font-medium">{courseTitle}</p>
        <dl className="mt-8 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium tracking-wide text-muted uppercase">
              Issued
            </dt>
            <dd className="mt-1 text-sm">{formatIssuedDate(issuedAt)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-muted uppercase">
              Status
            </dt>
            <dd
              className={`mt-1 text-sm font-medium ${
                revoked ? "text-danger" : "text-success"
              }`}
            >
              {revoked ? "Revoked" : "Valid"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium tracking-wide text-muted uppercase">
              Reference
            </dt>
            <dd className="mt-1 font-mono text-sm tracking-wide">
              {referenceNumber}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
