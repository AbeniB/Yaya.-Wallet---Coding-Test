const BASE = import.meta.env.VITE_BACKEND_BASE;

export async function fetchAllTransactions() {
  const res = await fetch(`${BASE}/api/transactions/all`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Error fetching all transactions: ${res.status} ${txt}`);
  }
  return res.json();
}
