import apiClient from "./client";

export const listTransactions = async () => {
  const { data } = await apiClient.get("/transactions");
  return data;
};

export const createTransaction = async ({ date, description, type, amount }) => {
  const { data } = await apiClient.post("/transactions", {
    date,
    description,
    type,
    amount,
  });
  return data;
};

export const updateTransaction = async (id, { date, description, type, amount }) => {
  const { data } = await apiClient.put(`/transactions/${id}`, {
    date,
    description,
    type,
    amount,
  });
  return data;
};

export const deleteTransaction = async (id) => {
  await apiClient.delete(`/transactions/${id}`);
};
