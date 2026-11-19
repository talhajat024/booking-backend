// Treats "YYYY-MM-DD HH:MM" as a plain calendar value, no timezone involved.
export function parseLocal(value: string): Date | null {
  console.log("parseLocal called with value:", value);
  const [datePart, timePart] = value.split(' ');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);

  const date = new Date(Date.UTC(y, m - 1, d, hh, mm));

  // Date silently rolls over bad input (month 13 becomes January),
  // so compare the parts back to catch impossible dates.
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d ||
    date.getUTCHours() !== hh ||
    date.getUTCMinutes() !== mm
  ) {
    return null;
  }
  return date;
}

export function formatLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  console.log("formatLocal called with date:", date);
  return `${date.getUTCFullYear()}-${p(date.getUTCMonth() + 1)}-${p(date.getUTCDate())} ${p(date.getUTCHours())}:${p(date.getUTCMinutes())}:00`;
}