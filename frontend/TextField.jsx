export default function TextField({ label, id, error, className = "", ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-md border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none ${
          error ? "border-negative" : "border-line focus:border-ledger-navy"
        }`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-negative">
          {error}
        </p>
      )}
    </div>
  );
}
