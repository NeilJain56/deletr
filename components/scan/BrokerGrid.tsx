import type { BrokerScanResult } from "@/types/broker";

interface Props {
  brokers: BrokerScanResult[];
}

export function BrokerGrid({ brokers }: Props) {
  const brokersWithData = brokers.filter((b) => b.hasData);
  const shown = brokersWithData.slice(0, 6);
  const remaining = brokersWithData.length - shown.length;

  return (
    <div className="rounded-xl border border-border">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium">
          Brokers with your data ({brokersWithData.length})
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        {shown.map((broker) => (
          <div
            key={broker.id}
            className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-danger" />
            <span className="text-sm font-medium">{broker.name}</span>
          </div>
        ))}
        {remaining > 0 && (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-border px-3 py-2.5">
            <span className="text-sm text-muted-foreground">
              + {remaining} more broker{remaining !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
