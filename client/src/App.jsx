import React, { useEffect, useState } from 'react';
import { fetchAllTransactions } from './api';
import TransactionTable from './components/TransactionTable';
import './App.css';

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
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAllTransactions();
  }, []);

  useEffect(() => {
    applyFilterAndSearch(selectedAccount, searchQuery);
    setPageIndex(0);
  }, [selectedAccount, allFetched]);

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
    <div className="app-container">
      <header className="app-header">
        <h1>YaYa Wallet — Transactions Dashboard</h1>
      </header>

      <div className="controls-container">
        <div className="form-group">
          <label htmlFor="account-select">Choose account:</label>
          <select 
            id="account-select"
            value={selectedAccount} 
            onChange={e => setSelectedAccount(e.target.value)}
            className="account-select"
          >
            {ACCOUNTS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="form-group search-group">
          <input
            placeholder="Search transactions (sender/receiver/cause/id)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={() => { setSearchQuery(''); applyFilterAndSearch(selectedAccount, ''); }}
            className="btn btn-secondary"
          >
            Clear
          </button>
          <button onClick={loadAllTransactions} className="btn btn-primary">
            Refresh All
          </button>
        </div>
      </div>

      <div className="status-container">
        {loading && <div className="loading">Loading transactions (fetching all pages)...</div>}
        {error && <div className="error">Error: {error}</div>}
        {!loading && !error && (
          <div className="results-info">
            Showing {filtered.length} transactions for <span className="account-name">{selectedAccount}</span> — 
            Page {pageIndex + 1} of {totalPages}
          </div>
        )}
      </div>

      <div className="table-container">
        <TransactionTable transactions={currentPageItems} currentAccount={selectedAccount} />
      </div>

      <div className="pagination-container">
        <button onClick={prevPage} disabled={pageIndex <= 0} className="btn btn-pagination">
          Previous
        </button>
        
        <div className="page-selector">
          <span>Go to page:</span>
          <select 
            value={pageIndex} 
            onChange={e => goToPage(Number(e.target.value))}
            className="page-select"
          >
            {Array.from({ length: totalPages }).map((_, idx) => (
              <option key={idx} value={idx}>{idx + 1}</option>
            ))}
          </select>
        </div>
        
        <button onClick={nextPage} disabled={pageIndex >= totalPages - 1} className="btn btn-pagination">
          Next
        </button>
        
        <div className="page-info">
          Page {pageIndex + 1} of {totalPages} — {filtered.length} total items
        </div>
      </div>
    </div>
  );
}