import React, { useEffect, useState } from 'react';
import { fetchAllTransactions } from './api';
import TransactionTable from './components/TransactionTable';

const ACCOUNTS = [
  'yayawalletpi',
  'antenehgebey',
  'tewobstatewo',
  'surafelaraya'
];

const PAGE_SIZE = 5;

export default function App() {
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNTS[0]);
  const [allFetched, setAllFetched] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0); // 0-based page index for client-side pagination
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAllTransactions();
  }, []);

  // when selectedAccount or allFetched changes, compute filtered list and reset page
  useEffect(() => {
    applyFilterAndSearch(selectedAccount, searchQuery);
    setPageIndex(0);
  }, [selectedAccount, allFetched]);

  // when search changes, filter within current account
  useEffect(() => {
    applyFilterAndSearch(selectedAccount, searchQuery);
    setPageIndex(0);
  }, [searchQuery]);

  async function loadAllTransactions() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllTransactions();
      const all = data.data || [];
      setAllFetched(all);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }

  function applyFilterAndSearch(account, query) {
    if (!account) {
      setFiltered([]);
      return;
    }

    const accountFiltered = allFetched.filter(tx => {
      const sa = tx.sender?.account;
      const ra = tx.receiver?.account;
      if (!sa && !ra) return false;
      
      return sa === account || ra === account;
    });

    // search only inside accountFiltered
    const q = (query || '').trim().toLowerCase();
    const searched = q === ''
      ? accountFiltered
      : accountFiltered.filter(tx => {
          const id = tx.id?.toLowerCase() || '';
          const senderName = (tx.sender?.name || tx.sender?.account || '').toLowerCase();
          const receiverName = (tx.receiver?.name || tx.receiver?.account || '').toLowerCase();
          const cause = (tx.cause || '').toLowerCase();
          return id.includes(q) || senderName.includes(q) || receiverName.includes(q) || cause.includes(q);
        });

    // sort by created_at_time descending (most recent first)
    searched.sort((a, b) => (b.created_at_time || 0) - (a.created_at_time || 0));

    setFiltered(searched);
  }


  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPageItems = filtered.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE);

  function prevPage() {
    setPageIndex(i => Math.max(0, i - 1));
  }
  function nextPage() {
    setPageIndex(i => Math.min(totalPages - 1, i + 1));
  }
  function goToPage(n) {
    if (n < 0 || n >= totalPages) return;
    setPageIndex(n);
  }

  return (
    <div style={{ maxWidth: 1100, margin: '24px auto', padding: 12 }}>
      <h2>YaYa Wallet — Transactions Dashboard</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <label>
          Choose account:{' '}
          <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)}>
            {ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>

        <input
          placeholder="Search this account's transactions (sender/receiver/cause/id)"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: 1 }}
        />

        <button onClick={() => { setSearchQuery(''); applyFilterAndSearch(selectedAccount, ''); }}>Clear</button>
        <button onClick={loadAllTransactions}>Refresh All</button>
      </div>

      <div style={{ marginBottom: 8 }}>
        {loading && <strong>Loading transactions (fetching all pages)...</strong>}
        {error && <strong style={{ color: 'crimson' }}>Error: {error}</strong>}
        {!loading && !error && (
          <div>
            <strong>
              Showing {filtered.length} transactions for <em>{selectedAccount}</em> — page {pageIndex + 1} / {totalPages}
            </strong>
          </div>
        )}
      </div>

      <TransactionTable transactions={currentPageItems} currentAccount={selectedAccount} />

      <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={prevPage} disabled={pageIndex <= 0}>Prev</button>
        <button onClick={nextPage} disabled={pageIndex >= totalPages - 1}>Next</button>

        <span>Go to page:</span>
        <select value={pageIndex} onChange={e => goToPage(Number(e.target.value))}>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <option key={idx} value={idx}>{idx + 1}</option>
          ))}
        </select>

        <span style={{ marginLeft: 8 }}>
          Page {pageIndex + 1} of {totalPages} — {filtered.length} total items
        </span>
      </div>
    </div>
  );
}
