import type { BrokerScanResult } from "@/types/broker";

interface Props {
  brokers: BrokerScanResult[];
}

export function BrokerGrid({ brokers }: Props) {
  const brokersWithData = brokers.filter((b) => b.hasData);

  return (
    <div className="rounded-xl border border-border">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-[13px] text-muted-foreground">
          Brokers with your data &middot; {brokersWithData.length}
        </h3>
      </div>
      <div className="divide-y divide-border">
        {brokersWithData.map((broker) => (
          <div
            key={broker.id}
            className="flex items-center gap-3 px-5 py-3"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-danger" />
            <span className="text-[14px] text-foreground">{broker.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
