import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import SummaryCard from "../components/SummaryCard";
import { fetchIncomeReport, fetchExpenseReport, fetchProfitReport } from "../api/reports";
import { formatCurrency } from "../utils/format";

export default function Reports() {
  const [income, setIncome] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [profit, setProfit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoadError("");
      try {
        const [incomeData, expenseData, profitData] = await Promise.all([
          fetchIncomeReport(),
          fetchExpenseReport(),
          fetchProfitReport(),
        ]);
        setIncome(incomeData);
        setExpenses(expenseData);
        setProfit(profitData);
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Share of income vs. expenses, for the proportion bar below.
  const total = (profit?.total_income || 0) + (profit?.total_expenses || 0);
  const incomeShare = total > 0 ? (profit.total_income / total) * 100 : 50;

  return (
    <AppLayout>
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
          Summaries
        </p>
        <h1 className="mt-1 font-display text-2xl text-ink">Reports</h1>
      </div>

      {loadError && (
        <p role="alert" className="mb-6 rounded-md bg-negative-bg px-4 py-3 text-sm text-negative">
          {loadError}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-ink-muted">Loading reports…</p>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Income summary"
              value={formatCurrency(income.total_income)}
              tone="positive"
            />
            <SummaryCard
              label="Expense summary"
              value={formatCurrency(expenses.total_expenses)}
              tone="negative"
            />
            <SummaryCard
              label="Profit summary"
              value={formatCurrency(profit.net_profit)}
              tone={profit.net_profit >= 0 ? "positive" : "negative"}
            />
          </div>

          <div className="rounded-lg border border-line bg-surface p-6 shadow-card">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-muted">
              Income vs. expenses
            </p>

            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-negative-bg">
              <div
                className="h-full bg-positive transition-all"
                style={{ width: `${incomeShare}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span className="figure text-positive">
                {formatCurrency(profit.total_income)} income
              </span>
              <span className="figure text-negative">
                {formatCurrency(profit.total_expenses)} expenses
              </span>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
