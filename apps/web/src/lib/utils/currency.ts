export function formatCurrency(amountCents: number): string {
  if (amountCents === 0) return "Rp 0";
  return `Rp ${amountCents.toLocaleString("id-ID")}`;
}

export function formatCurrencyCompact(amountCents: number): string {
  if (amountCents >= 1_000_000) {
    return `Rp ${(amountCents / 1_000_000).toFixed(1).replace(".0", "")}jt`;
  }
  if (amountCents >= 1_000) {
    return `Rp ${(amountCents / 1_000).toFixed(0)}rb`;
  }
  return formatCurrency(amountCents);
}

export function parseCurrencyInput(input: string): number {
  return parseInt(input.replace(/\D/g, ""), 10) || 0;
}

export function formatInputCurrency(value: string): string {
  const num = parseCurrencyInput(value);
  if (num === 0) return "";
  return num.toLocaleString("id-ID");
}
