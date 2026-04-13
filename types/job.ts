import { BrokerRemovalResult } from "./broker";

export interface DeletionJob {
  status: "running" | "complete" | "failed";
  total: number;
  completed: number;
  brokers: BrokerRemovalResult[];
}
