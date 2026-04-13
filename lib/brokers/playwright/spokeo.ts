import { createMockBrokerScript } from "./base";

// Real implementation would use Playwright:
// import { chromium } from "playwright";
// export const spokeo: BrokerScript = {
//   id: "spokeo", name: "Spokeo",
//   async remove(identifier, type) {
//     const browser = await chromium.launch({ headless: true });
//     const page = await browser.newPage();
//     try {
//       await page.goto("https://www.spokeo.com/optout", { waitUntil: "networkidle" });
//       // Fill opt-out form and submit
//     } finally { await browser.close(); }
//   }
// };

export const spokeo = createMockBrokerScript("spokeo", "Spokeo", 2000);
