import { BrokerScanResult } from "./broker";

export interface ExposureCategories {
  addresses: number;
  phoneNumbers: number;
  emailAddresses: number;
  knownAssociates: number;
  propertyRecords: boolean;
  financialRecords: boolean;
}

export interface ExposureReport {
  privacyScore: number;
  categories: ExposureCategories;
  brokersFound: BrokerScanResult[];
  spamEstimate: number;
  reportId: string;
}
