"use client";

export function PrivacyScoreRing({ score }: { score: number }) {
  const color =
    score < 40 ? "text-danger" : score < 70 ? "text-warning" : "text-teal";
  const label =
    score < 40 ? "High Risk" : score < 70 ? "Moderate Risk" : "Low Risk";
  const description =
    score < 40
      ? "Your personal information is widely exposed across data brokers."
      : score < 70
        ? "Some of your data is available on multiple broker sites."
        : "Limited exposure detected, but removal is still recommended.";
  const dotColor =
    score < 40 ? "bg-danger" : score < 70 ? "bg-warning" : "bg-teal";

  return (
    <div className="rounded-xl border border-border p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          <span className="text-[13px] text-muted-foreground">Privacy Score</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-heading text-3xl tracking-tight ${color}`}>{score}</span>
          <span className="text-[12px] text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className={`text-[12px] font-medium ${color}`}>{label}</span>
        <span className="text-[12px] text-muted-foreground">&middot;</span>
        <span className="text-[12px] text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}
