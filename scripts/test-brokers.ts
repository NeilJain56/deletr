import { BROKER_LIST } from "../lib/brokers/constants";

async function main() {
  console.log("Testing all broker scripts...\n");
  let failures = 0;

  for (const broker of BROKER_LIST) {
    process.stdout.write(`  ${broker.name}... `);
    try {
      // Import and test each broker script
      const mod = await import(`../lib/brokers/playwright/${broker.id}`);
      const script = mod[broker.id] || mod.default;
      if (!script || typeof script.remove !== "function") {
        throw new Error("Missing remove() function");
      }
      await script.remove("+15555555555", "phone");
      console.log("OK");
    } catch (err) {
      failures++;
      console.log(`FAIL — ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\n${BROKER_LIST.length - failures}/${BROKER_LIST.length} brokers passed.`);

  if (failures > 0) {
    process.exit(1);
  }
}

main();
