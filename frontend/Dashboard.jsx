import { useCallback, useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import SummaryCard from "../components/SummaryCard";
import TransactionsTable from "../components/TransactionsTable";
import TransactionForm from "../components/TransactionForm";
import ConfirmDialog from "../components/ConfirmDialog";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { fetchDashboardSummary } from "../api/reports";
import {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/transactions";
import { formatCurrency } from "../utils/format";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // null = closed, "add" = create form, a transaction object = edit form
  const [formModal, setFormModal] = useState(null);
  // transaction pending deletion, or null
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadData = useCallback(async () => {
    setLoadError("");
    try {
      const [summaryData, transactionsData] = await Promise.all([
        fetchDashboardSummary(),
        listTransactions(),
      ]);
      setSummary(summaryData);
      setTransactions(transactionsData);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (values) => {
    await createTransaction(values);
    setFormModal(null);
    await loadData();
  };

  const handleUpdate = async (values) => {
    await updateTransaction(formModal.id, values);
    setFormModal(null);
    await loadData();
  };

  const handleDelete = async () => {
    await deleteTransaction(pendingDelete.id);
    setPendingDelete(null);
    await loadData();
  };

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
            Overview
          </p>
          <h1 className="mt-1 font-display text-2xl text-ink">Dashboard</h1>
        </div>
        <Button onClick={() => setFormModal("add")}>Add transaction</Button>
      </div>

      {loadError && (
        <p role="alert" className="mb-6 rounded-md bg-negative-bg px-4 py-3 text-sm text-negative">
          {loadError}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-ink-muted">Loading your ledger…</p>
      ) : (
        <>
          {summary && (
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <SummaryCard
                label="Total income"
                value={formatCurrency(summary.total_income)}
                tone="positive"
              />
              <SummaryCard
                label="Total expenses"
                value={formatCurrency(summary.total_expenses)}
                tone="negative"
              />
              <SummaryCard
                label="Net profit"
                value={formatCurrency(summary.net_profit)}
                tone={summary.net_profit >= 0 ? "positive" : "negative"}
              />
              <SummaryCard
                label="Transactions"
                value={String(summary.transaction_count)}
              />
            </div>
          )}

          <TransactionsTable
            transactions={transactions}
            onEdit={(tx) => setFormModal(tx)}
            onDelete={(tx) => setPendingDelete(tx)}
          />
        </>
      )}

      {formModal && (
        <Modal
          title={formModal === "add" ? "Add transaction" : "Edit transaction"}
          onClose={() => setFormModal(null)}
        >
          <TransactionForm
            initialValues={formModal === "add" ? null : formModal}
            onSubmit={formModal === "add" ? handleCreate : handleUpdate}
            onCancel={() => setFormModal(null)}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete transaction"
          message={`Delete "${pendingDelete.description}"? This can't be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </AppLayout>
  );
}
