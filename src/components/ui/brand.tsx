import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Great 20 Sacco home">
      <span className="brand__mark" aria-hidden="true" />
    </Link>
  );
}
