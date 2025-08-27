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
    <div className="table-responsive">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Transaction ID</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th className="text-right">Amount</th>
            <th>Currency</th>
            <th>Cause</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 && (
            <tr>
              <td colSpan={8} className="no-data">
                No transactions to display.
              </td>
            </tr>
          )}
          {transactions.map(tx => {
            const incoming = isIncoming(tx);
            const createdAt = tx.created_at_time ? new Date(tx.created_at_time * 1000) : null;
            return (
              <tr key={tx.id} className={incoming ? 'incoming' : 'outgoing'}>
                <td className="transaction-type">{incoming ? '⬅️ Incoming' : '➡️ Outgoing'}</td>
                <td className="transaction-id">{tx.id}</td>
                <td>{tx.sender?.name || tx.sender?.account}</td>
                <td>{tx.receiver?.name || tx.receiver?.account}</td>
                <td className="text-right">{tx.amount_with_currency ?? tx.amount}</td>
                <td>{tx.currency}</td>
                <td>{tx.cause}</td>
                <td>{createdAt ? createdAt.toLocaleString() : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}