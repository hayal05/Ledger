export default function Select({ label, id, error, options, className = "", ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        className={`w-full rounded-md border bg-surface px-3 py-2.5 text-sm text-ink focus:outline-none ${
          error ? "border-negative" : "border-line focus:border-ledger-navy"
        }`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-negative">
          {error}
        </p>
      )}
    </div>
  );
}
