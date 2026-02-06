import { describe, it, expect } from "vitest";
import { resolveCoinId, getCoinSymbol, getCoinDecimals, getAvailableSymbols } from "../src/assets.js";

describe("assets registry", () => {
  describe("resolveCoinId", () => {
    it("resolves by symbol (case insensitive)", () => {
      expect(resolveCoinId("UCT")).toBe("unicity");
      expect(resolveCoinId("uct")).toBe("unicity");
      expect(resolveCoinId("BTC")).toBe("bitcoin");
      expect(resolveCoinId("btc")).toBe("bitcoin");
    });

    it("resolves by name", () => {
      expect(resolveCoinId("unicity")).toBe("unicity");
      expect(resolveCoinId("bitcoin")).toBe("bitcoin");
      expect(resolveCoinId("solana")).toBe("solana");
      expect(resolveCoinId("ethereum")).toBe("ethereum");
    });

    it("returns null for unknown coin", () => {
      expect(resolveCoinId("FAKE")).toBeNull();
      expect(resolveCoinId("xyz")).toBeNull();
    });

    it("trims whitespace", () => {
      expect(resolveCoinId("  UCT  ")).toBe("unicity");
    });
  });

  describe("getCoinSymbol", () => {
    it("returns symbol for known coins", () => {
      expect(getCoinSymbol("unicity")).toBe("UCT");
      expect(getCoinSymbol("bitcoin")).toBe("BTC");
      expect(getCoinSymbol("unicity-usd")).toBe("USDU");
      expect(getCoinSymbol("unicity-eur")).toBe("EURU");
    });

    it("returns uppercase name for unknown coins", () => {
      expect(getCoinSymbol("unknown")).toBe("UNKNOWN");
    });
  });

  describe("getCoinDecimals", () => {
    it("returns decimals for known coins", () => {
      expect(getCoinDecimals("unicity")).toBe(18);
      expect(getCoinDecimals("bitcoin")).toBe(8);
      expect(getCoinDecimals("unicity-usd")).toBe(6);
      expect(getCoinDecimals("solana")).toBe(9);
    });

    it("returns undefined for unknown coins", () => {
      expect(getCoinDecimals("unknown")).toBeUndefined();
    });
  });

  describe("getAvailableSymbols", () => {
    it("returns all fungible coin symbols", () => {
      const symbols = getAvailableSymbols();
      expect(symbols).toContain("UCT");
      expect(symbols).toContain("BTC");
      expect(symbols).toContain("ETH");
      expect(symbols).toContain("SOL");
      expect(symbols).toContain("USDU");
      expect(symbols).toContain("EURU");
      expect(symbols).toContain("USDT");
      expect(symbols).toContain("USDC");
      expect(symbols).toContain("ALPHT");
    });

    it("does not include non-fungible assets", () => {
      const symbols = getAvailableSymbols();
      // The non-fungible "unicity" entry has no symbol, so it shouldn't appear
      expect(symbols.filter((s) => s === "unicity")).toHaveLength(0);
    });
  });
});
