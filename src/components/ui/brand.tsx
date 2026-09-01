import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="Great 20 Sacco home">
      <span className="brand__mark" aria-hidden="true" />
      {!compact && (
        <span className="brand__text">
          <strong>Great 20</strong>
          <small>Sacco</small>
        </span>
      )}
    </Link>
  );
}
