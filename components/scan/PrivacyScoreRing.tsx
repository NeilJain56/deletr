"use client";

export function PrivacyScoreRing({ score }: { score: number }) {
  const color =
    score < 40 ? "text-danger" : score < 70 ? "text-warning" : "text-teal";
  const borderColor =
    score < 40
      ? "border-danger"
      : score < 70
        ? "border-warning"
        : "border-teal";
  const label =
    score < 40 ? "High Risk" : score < 70 ? "Moderate Risk" : "Low Risk";
  const description =
    score < 40
      ? "Your personal information is widely exposed across data brokers."
      : score < 70
        ? "Some of your data is available on multiple broker sites."
        : "Limited exposure detected, but removal is still recommended.";
  const pillColor =
    score < 40
      ? "bg-danger-light text-danger"
      : score < 70
        ? "bg-warning-light text-warning"
        : "bg-teal-light text-teal-dark";

  return (
    <div className="flex items-center gap-6 rounded-xl border border-border p-6">
      <div
        className={`flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-4 ${borderColor}`}
      >
        <span className={`text-3xl font-semibold ${color}`}>{score}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Privacy Score</h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${pillColor}`}
          >
            {label}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
