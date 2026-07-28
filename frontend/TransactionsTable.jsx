import { formatCurrency, formatDate } from "../utils/format";

export default function TransactionsTable({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-surface px-6 py-16 text-center">
        <p className="font-display text-lg text-ink">No entries yet</p>
        <p className="mt-1 text-sm text-ink-muted">
          Add your first transaction to start your ledger.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface shadow-card">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-paper/60">
            <th className="px-4 py-3 font-medium text-ink-muted">Date</th>
            <th className="px-4 py-3 font-medium text-ink-muted">Description</th>
            <th className="px-4 py-3 font-medium text-ink-muted">Type</th>
            <th className="px-4 py-3 text-right font-medium text-ink-muted">Amount</th>
            <th className="px-4 py-3 text-right font-medium text-ink-muted">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-line last:border-0 hover:bg-paper/40">
              <td className="figure px-4 py-3 text-ink-muted">{formatDate(tx.date)}</td>
              <td className="px-4 py-3 text-ink">{tx.description}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    tx.type === "income"
                      ? "bg-positive-bg text-positive"
                      : "bg-negative-bg text-negative"
                  }`}
                >
                  {tx.type === "income" ? "Income" : "Expense"}
                </span>
              </td>
              <td
                className={`figure px-4 py-3 text-right font-medium ${
                  tx.type === "income" ? "text-positive" : "text-negative"
                }`}
              >
                {tx.type === "income" ? "+" : "−"}
                {formatCurrency(tx.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(tx)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-ledger-navy hover:bg-ledger-navy/10"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(tx)}
                  className="ml-1 rounded-md px-2 py-1 text-xs font-medium text-negative hover:bg-negative-bg"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
