import { defineConfig } from "@playwright/test";

// Browser-/Integrationstests laufen gegen einen Produktions-Build
// (npm run test:e2e = next build + next start). Alle externen Tracking- und
// Backend-Requests werden in den Tests abgefangen — es entstehen keine echten
// Leads, Buchungen oder Google-/Meta-Requests.
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3111",
    // Nutzt das lokal installierte Google Chrome statt eines Browser-Downloads.
    channel: "chrome",
    headless: true
  },
  webServer: {
    command: "npx next start -p 3111",
    url: "http://localhost:3111",
    reuseExistingServer: true,
    timeout: 60_000
  }
});
