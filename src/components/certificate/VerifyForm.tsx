import { lookupCertificate } from "@/app/verify/actions";

export function VerifyForm({
  defaultValue = "",
  error,
}: {
  defaultValue?: string;
  error?: string;
}) {
  return (
    <form action={lookupCertificate} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label className="label" htmlFor="ref">
            Certificate reference
          </label>
          <input
            id="ref"
            name="ref"
            defaultValue={defaultValue}
            className="field mt-1.5 font-mono"
            placeholder="SSA-2026-XXXXXX"
            autoComplete="off"
            spellCheck={false}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary sm:shrink-0">
          Verify
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </form>
  );
}
