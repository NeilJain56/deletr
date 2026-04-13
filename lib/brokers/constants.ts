import type { Broker } from "@/types/broker";

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
