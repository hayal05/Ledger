import apiClient from "./client";

export const fetchDashboardSummary = async () => {
  const { data } = await apiClient.get("/dashboard/summary");
  return data; // { total_income, total_expenses, net_profit, transaction_count }
};

export const fetchIncomeReport = async () => {
  const { data } = await apiClient.get("/reports/income");
  return data;
};

export const fetchExpenseReport = async () => {
  const { data } = await apiClient.get("/reports/expenses");
  return data;
};

export const fetchProfitReport = async () => {
  const { data } = await apiClient.get("/reports/profit");
  return data;
};
