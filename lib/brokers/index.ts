import crypto from "crypto";
import type { Broker, BrokerScanResult } from "@/types/broker";
import type { ExposureCategories, ExposureReport } from "@/types/scan";

export const BROKER_LIST: Broker[] = [
  { id: "spokeo", name: "Spokeo", optOutUrl: "https://www.spokeo.com/optout" },
  { id: "whitepages", name: "Whitepages", optOutUrl: "https://www.whitepages.com/suppression_requests" },
  { id: "radaris", name: "Radaris", optOutUrl: "https://radaris.com/opt-out" },
  { id: "beenverified", name: "BeenVerified", optOutUrl: "https://www.beenverified.com/opt-out" },
  { id: "intelius", name: "Intelius", optOutUrl: "https://www.intelius.com/opt-out" },
  { id: "peoplefinder", name: "PeopleFinder", optOutUrl: "https://www.peoplefinders.com/opt-out" },
  { id: "mylife", name: "MyLife", optOutUrl: "https://www.mylife.com/privacy/remove-my-information.pubview" },
  { id: "fastpeoplesearch", name: "FastPeopleSearch", optOutUrl: "https://www.fastpeoplesearch.com/removal" },
  { id: "truthfinder", name: "TruthFinder", optOutUrl: "https://www.truthfinder.com/opt-out" },
  { id: "instantcheckmate", name: "Instant Checkmate", optOutUrl: "https://www.instantcheckmate.com/opt-out" },
];

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = h ^ (h >>> 16);
    return (h >>> 0) / 4294967296;
  };
}

export async function scanBrokers(identifier: string): Promise<BrokerScanResult[]> {
  // Mock — replace with real API call (Optery/Kanary) when approved
  await new Promise((r) => setTimeout(r, 2000));

  const hash = crypto.createHash("sha256").update(identifier).digest("hex");
  const rng = seededRandom(hash);

  return BROKER_LIST.map((broker) => ({
    id: broker.id,
    name: broker.name,
    hasData: rng() > 0.4, // ~60% hit rate
  }));
}

const REDACTED_ADDRESSES = [
  "123 M*** St, San F***, CA",
  "456 O*** Ave, Los A***, CA",
  "789 E*** Blvd, New Y***, NY",
  "321 P*** Dr, Sea***, WA",
  "654 L*** Ln, Chi***, IL",
  "987 W*** Ct, Aus***, TX",
];

const REDACTED_PHONES = [
  "(415) ***-**89",
  "(212) ***-**34",
  "(310) ***-**56",
  "(206) ***-**12",
  "(512) ***-**78",
];

const REDACTED_EMAILS = [
  "j***@gm***.com",
  "m***@ya***.com",
  "s***@ou***.com",
  "d***@ho***.com",
  "a***@pr***.net",
];

const REDACTED_ASSOCIATES = [
  "M*** S***",
  "R*** J***",
  "J*** D***",
  "S*** W***",
  "A*** B***",
  "K*** L***",
  "T*** R***",
  "L*** M***",
];

function pickN<T>(arr: T[], count: number, rng: () => number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export function generateCategories(identifier: string): ExposureCategories {
  const hash = crypto.createHash("sha256").update(identifier).digest("hex");
  const rng = seededRandom(hash + "cats");

  const addresses = Math.floor(rng() * 4) + 1;
  const phoneNumbers = Math.floor(rng() * 3) + 1;
  const emailAddresses = Math.floor(rng() * 3) + 1;
  const knownAssociates = Math.floor(rng() * 6);
  const propertyRecords = rng() > 0.4;
  const financialRecords = rng() > 0.6;

  const redactedDetails = {
    addresses: pickN(REDACTED_ADDRESSES, addresses, rng),
    phoneNumbers: pickN(REDACTED_PHONES, phoneNumbers, rng),
    emailAddresses: pickN(REDACTED_EMAILS, emailAddresses, rng),
    associates: knownAssociates > 0 ? pickN(REDACTED_ASSOCIATES, knownAssociates, rng) : undefined,
  };

  return {
    addresses,
    phoneNumbers,
    emailAddresses,
    knownAssociates,
    propertyRecords,
    financialRecords,
    redactedDetails,
  };
}

export function calculatePrivacyScore(
  categories: ExposureCategories,
  brokersWithData: number
): number {
  let score = 100;

  // -15 per address (cap -30)
  score -= Math.min(categories.addresses * 15, 30);
  // -10 per phone (cap -20)
  score -= Math.min(categories.phoneNumbers * 10, 20);
  // -5 per email (cap -15)
  score -= Math.min(categories.emailAddresses * 5, 15);
  // -8 if property records
  if (categories.propertyRecords) score -= 8;
  // -2 per associate (cap -14)
  score -= Math.min(categories.knownAssociates * 2, 14);
  // -1 per broker with data (cap -20)
  score -= Math.min(brokersWithData, 20);

  return Math.max(score, 5);
}

export function buildExposureReport(
  identifier: string,
  brokerResults: BrokerScanResult[],
  reportId: string
): ExposureReport {
  const categories = generateCategories(identifier);
  const brokersWithData = brokerResults.filter((b) => b.hasData).length;
  const privacyScore = calculatePrivacyScore(categories, brokersWithData);
  const spamEstimate = Math.round(brokersWithData * 2.7);

  return {
    privacyScore,
    categories,
    brokersFound: brokerResults,
    spamEstimate,
    reportId,
  };
}
