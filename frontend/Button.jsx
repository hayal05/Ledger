const VARIANTS = {
  primary:
    "bg-ledger-navy text-white hover:bg-ledger-navy-hover disabled:bg-ink-faint",
  ghost: "bg-transparent text-ink hover:bg-ink/5 disabled:text-ink-faint",
};

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={isLoading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
