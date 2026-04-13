// Base interface for all broker opt-out scripts.
// Mock implementation for MVP — swap method bodies for real Playwright automation.

export interface BrokerScript {
  id: string;
  name: string;
  remove(identifier: string, type: "phone" | "email"): Promise<void>;
}

export function createMockBrokerScript(
  id: string,
  name: string,
  delayMs: number = 2000
): BrokerScript {
  return {
    id,
    name,
    async remove(_identifier: string, _type: "phone" | "email"): Promise<void> {
      // Simulate realistic opt-out processing time
      await new Promise((r) => setTimeout(r, delayMs + Math.random() * 2000));

      // ~10% failure rate to simulate real-world conditions
      if (Math.random() < 0.1) {
        throw new Error(`${name} opt-out form submission failed`);
      }
    },
  };
}
