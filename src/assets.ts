/** Asset registry — loads coin metadata from unicity-ids JSON. */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface AssetEntry {
  network: string;
  assetKind: string;
  name: string;
  symbol?: string;
  decimals?: number;
  description?: string;
  id: string;
}

interface AssetRegistry {
  /** Map from lowercase name or symbol to faucet coin name */
  aliases: Map<string, string>;
  /** Map from faucet coin name to display symbol */
  symbols: Map<string, string>;
  /** Map from faucet coin name to decimals */
  decimals: Map<string, number>;
  /** List of all available symbols for display */
  availableSymbols: string[];
}

let cachedRegistry: AssetRegistry | null = null;

function loadRegistry(): AssetRegistry {
  if (cachedRegistry) return cachedRegistry;

  const jsonPath = join(__dirname, "resources", "unicity-ids.testnet.json");
  const raw = readFileSync(jsonPath, "utf-8");
  const entries: AssetEntry[] = JSON.parse(raw);

  const aliases = new Map<string, string>();
  const symbols = new Map<string, string>();
  const decimals = new Map<string, number>();
  const availableSymbols: string[] = [];

  for (const entry of entries) {
    // Only include fungible assets
    if (entry.assetKind !== "fungible") continue;
    if (!entry.symbol) continue;

    const name = entry.name;
    const symbol = entry.symbol;

    // Map both name and symbol (lowercase) to the faucet coin name
    aliases.set(name.toLowerCase(), name);
    aliases.set(symbol.toLowerCase(), name);

    // Store display symbol and decimals
    symbols.set(name, symbol);
    if (entry.decimals !== undefined) {
      decimals.set(name, entry.decimals);
    }

    availableSymbols.push(symbol);
  }

  cachedRegistry = { aliases, symbols, decimals, availableSymbols };
  return cachedRegistry;
}

/** Resolve user input (name or symbol) to faucet coin name, or null if not found */
export function resolveCoinId(input: string): string | null {
  const registry = loadRegistry();
  return registry.aliases.get(input.toLowerCase().trim()) ?? null;
}

/** Get display symbol for a faucet coin name */
export function getCoinSymbol(coinName: string): string {
  const registry = loadRegistry();
  return registry.symbols.get(coinName) ?? coinName.toUpperCase();
}

/** Get decimals for a faucet coin name */
export function getCoinDecimals(coinName: string): number | undefined {
  const registry = loadRegistry();
  return registry.decimals.get(coinName);
}

/** Get list of all available symbols for display */
export function getAvailableSymbols(): string[] {
  const registry = loadRegistry();
  return registry.availableSymbols;
}
