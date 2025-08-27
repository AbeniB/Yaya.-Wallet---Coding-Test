import React from 'react';

export default function TransactionTable({ transactions = [], currentAccount }) {
  function isIncoming(tx) {
    if (!currentAccount) return false;
    const senderAcc = tx.sender?.account;
    const receiverAcc = tx.receiver?.account;

    if (tx.is_topup === true && senderAcc === currentAccount && receiverAcc === currentAccount) return true;
    if (receiverAcc === currentAccount) return true;
    return false;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: 8 }}>Type</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Transaction ID</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Sender</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Receiver</th>
          <th style={{ textAlign: 'right', padding: 8 }}>Amount</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Currency</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Cause</th>
          <th style={{ textAlign: 'left', padding: 8 }}>Created At</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length === 0 && (
          <tr>
            <td colSpan={8} style={{ padding: 12 }}>No transactions to display.</td>
          </tr>
        )}
        {transactions.map(tx => {
          const incoming = isIncoming(tx);
          const createdAt = tx.created_at_time ? new Date(tx.created_at_time * 1000) : null;
          return (
            <tr key={tx.id} style={{ background: incoming ? '#e9ffef' : '#fff6f6' }}>
              <td style={{ padding: 8 }}>{incoming ? '⬅️ Incoming' : '➡️ Outgoing'}</td>
              <td style={{ padding: 8 }}>{tx.id}</td>
              <td style={{ padding: 8 }}>{tx.sender?.name || tx.sender?.account}</td>
              <td style={{ padding: 8 }}>{tx.receiver?.name || tx.receiver?.account}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{tx.amount_with_currency ?? tx.amount}</td>
              <td style={{ padding: 8 }}>{tx.currency}</td>
              <td style={{ padding: 8 }}>{tx.cause}</td>
              <td style={{ padding: 8 }}>{createdAt ? createdAt.toLocaleString() : '-'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
