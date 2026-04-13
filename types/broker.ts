export interface Broker {
  id: string;
  name: string;
  optOutUrl: string;
}

export interface BrokerScanResult {
  id: string;
  name: string;
  hasData: boolean;
}

export interface BrokerRemovalResult {
  id: string;
  name: string;
  status: "removed" | "failed" | "pending" | "in_progress";
  timestamp: string;
}
