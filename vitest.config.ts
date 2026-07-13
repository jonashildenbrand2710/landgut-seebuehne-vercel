import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url))
    }
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    // DOM-abhängige Tests setzen "// @vitest-environment jsdom" in der Datei.
    environment: "node",
    setupFiles: ["tests/unit/setup.ts"]
  }
});
