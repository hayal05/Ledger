const TONES = {
  neutral: "text-ink",
  positive: "text-positive",
  negative: "text-negative",
};

export default function SummaryCard({ label, value, tone = "neutral" }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5 shadow-card">
      <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink-muted">
        {label}
      </p>
      <p className={`figure mt-2 text-2xl font-medium ${TONES[tone]}`}>{value}</p>
    </div>
  );
}
