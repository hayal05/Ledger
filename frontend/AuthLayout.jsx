export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Brand panel */}
      <div className="ledger-ruled relative hidden flex-col justify-between overflow-hidden bg-ledger-navy px-12 py-10 text-white lg:flex">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">
            LedgerPro
          </p>
          <div className="mt-1 h-px w-10 bg-white/30" />
        </div>

        <div className="max-w-sm">
          <p className="font-display text-4xl leading-snug">
            Every entry, <br /> accounted for.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Track income and expenses, and see your net position update the
            moment you log a transaction.
          </p>
        </div>

        <div className="flex items-baseline gap-3 font-mono text-xs text-white/50">
          <span>No. 001</span>
          <span className="h-px flex-1 bg-white/20" />
          <span>Ledger Book</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-paper px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              LedgerPro
            </p>
          </div>

          {eyebrow && (
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-3xl text-ink">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>}

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
