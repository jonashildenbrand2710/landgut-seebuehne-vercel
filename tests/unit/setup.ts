// Testumgebungs-Fixes: Node >= 22 bringt ein experimentelles localStorage-
// Global mit, das jsdoms Storage überdeckt und keine echten Methoden hat.
// Außerdem fehlt in jsdom crypto.subtle — dafür dient Nodes WebCrypto.
import { webcrypto } from "node:crypto";

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    }
  };
}

if (typeof window !== "undefined") {
  for (const name of ["localStorage", "sessionStorage"] as const) {
    let needsShim = false;
    try {
      window[name].setItem("__lsb_probe__", "1");
      window[name].removeItem("__lsb_probe__");
    } catch {
      needsShim = true;
    }

    if (needsShim || typeof window[name]?.clear !== "function") {
      Object.defineProperty(window, name, { configurable: true, value: createMemoryStorage() });
      Object.defineProperty(globalThis, name, {
        configurable: true,
        value: window[name]
      });
    }
  }

  if (!globalThis.crypto?.subtle) {
    Object.defineProperty(globalThis, "crypto", { configurable: true, value: webcrypto });
  }
}
