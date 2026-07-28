import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-ink-muted">{message}</p>

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-negative-bg px-3 py-2 text-sm text-negative">
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          isLoading={isSubmitting}
          className="!bg-negative hover:!bg-negative/90"
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
