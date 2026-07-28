import { useState } from "react";
import TextField from "./TextField";
import Select from "./Select";
import Button from "./Button";
import { todayISODate } from "../utils/format";

const TYPE_OPTIONS = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

export default function TransactionForm({ initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    date: initialValues?.date || todayISODate(),
    description: initialValues?.description || "",
    type: initialValues?.type || "income",
    amount: initialValues?.amount != null ? String(initialValues.amount) : "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    if (!form.date) errors.date = "Date is required.";
    if (!form.description.trim()) errors.description = "Description is required.";
    const amountNum = Number(form.amount);
    if (!form.amount || Number.isNaN(amountNum)) {
      errors.amount = "Enter a valid amount.";
    } else if (amountNum <= 0) {
      errors.amount = "Amount must be greater than zero.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        date: form.date,
        description: form.description.trim(),
        type: form.type,
        amount: Number(form.amount),
      });
    } catch (err) {
      setFormError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField
        id="date"
        label="Date"
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        error={fieldErrors.date}
      />
      <TextField
        id="description"
        label="Description"
        placeholder="e.g. Client invoice #204"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        error={fieldErrors.description}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="type"
          label="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          options={TYPE_OPTIONS}
        />
        <TextField
          id="amount"
          label="Amount"
          type="number"
          step="0.01"
          min="0.01"
          inputMode="decimal"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          error={fieldErrors.amount}
        />
      </div>

      {formError && (
        <p role="alert" className="rounded-md bg-negative-bg px-3 py-2 text-sm text-negative">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialValues ? "Save changes" : "Add transaction"}
        </Button>
      </div>
    </form>
  );
}
