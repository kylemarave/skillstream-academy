"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyReferenceButton({
  referenceNumber,
}: {
  referenceNumber: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn btn-secondary"
    >
      {copied ? (
        <Check aria-hidden="true" size={16} />
      ) : (
        <Copy aria-hidden="true" size={16} />
      )}
      {copied ? "Copied" : "Copy reference"}
    </button>
  );
}
