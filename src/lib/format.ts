export function formatKES(value: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function normalizeKenyanPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (/^254(7|1)\d{8}$/.test(digits)) return `+${digits}`;
  if (/^0(7|1)\d{8}$/.test(digits)) return `+254${digits.slice(1)}`;
  if (/^(7|1)\d{8}$/.test(digits)) return `+254${digits}`;
  return null;
}
