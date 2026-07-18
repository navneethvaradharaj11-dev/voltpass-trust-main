import { describe, it, expect } from "vitest";
import { calculateTrustScore, categorize, sohPercent } from "./trust-score";
import type { BatteryMetrics } from "./trust-score";

describe("Trust Score Engine", () => {
  const perfectBattery: BatteryMetrics = {
    original_capacity_kwh: 100,
    current_capacity_kwh: 100,
    charge_cycles: 0,
    avg_operating_temp_c: 25,
    fast_charging_freq_pct: 0,
    fault_count: 0,
  };

  describe("calculateTrustScore", () => {
    it("should return 100 for a perfect battery", () => {
      const score = calculateTrustScore(perfectBattery);
      expect(score).toBe(100);
    });

    it("should correctly penalize high charge cycles", () => {
      const degradedBattery = { ...perfectBattery, charge_cycles: 1500 };
      const score = calculateTrustScore(degradedBattery);
      expect(score).toBeLessThan(100);
      expect(score).toBe(80); // cycles score: max(0, 100 - 1500/15) = 0. So cycles * 0.2 is 0 instead of 20. Total drops by 20.
    });

    it("should correctly penalize high operating temperatures", () => {
      const hotBattery = { ...perfectBattery, avg_operating_temp_c: 35 };
      const score = calculateTrustScore(hotBattery);
      expect(score).toBeLessThan(100);
      expect(score).toBe(88); // temp: 35 - 25 = 10. 10 * 8 = 80. 100 - 80 = 20. 20 * 0.15 = 3. instead of 15. Drops by 12.
    });

    it("should correctly penalize high fast charging frequency", () => {
      const fastBattery = { ...perfectBattery, fast_charging_freq_pct: 50 };
      const score = calculateTrustScore(fastBattery);
      expect(score).toBe(90); // fast: 100 - 100 = 0. Drops by 10.
    });

    it("should correctly penalize faults", () => {
      const faultyBattery = { ...perfectBattery, fault_count: 5 };
      const score = calculateTrustScore(faultyBattery);
      expect(score).toBe(93); // fault: 100 - 75 = 25. 25 * 0.1 = 2.5. Drops by 7.5 -> rounded -> 93.
    });

    it("should accurately reflect SOH degradation", () => {
      const degradedSohBattery = { ...perfectBattery, current_capacity_kwh: 70 };
      const score = calculateTrustScore(degradedSohBattery);
      // SOH is 70. 
      // soh * 0.35 = 24.5 (was 35)
      // remaining * 0.1 = 7 (was 10)
      // Drops by 10.5 + 3 = 13.5 -> score should be 100 - 13.5 = 86.5 -> 87
      expect(score).toBe(87);
    });

    it("should bound the score between 0 and 100", () => {
      const terribleBattery: BatteryMetrics = {
        original_capacity_kwh: 100,
        current_capacity_kwh: 10,
        charge_cycles: 5000,
        avg_operating_temp_c: 50,
        fast_charging_freq_pct: 100,
        fault_count: 20,
      };
      const score = calculateTrustScore(terribleBattery);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("categorize", () => {
    it('returns "Excellent" for scores >= 90', () => {
      const cat = categorize(95);
      expect(cat.label).toBe("Excellent");
      expect(cat.tone).toBe("success");
    });

    it('returns "Good" for scores >= 75 and < 90', () => {
      const cat = categorize(80);
      expect(cat.label).toBe("Good");
      expect(cat.tone).toBe("primary");
    });

    it('returns "Moderate" for scores >= 60 and < 75', () => {
      const cat = categorize(65);
      expect(cat.label).toBe("Moderate");
      expect(cat.tone).toBe("warning");
    });

    it('returns "High Risk" for scores < 60', () => {
      const cat = categorize(40);
      expect(cat.label).toBe("High Risk");
      expect(cat.tone).toBe("destructive");
    });
  });

  describe("sohPercent", () => {
    it("calculates accurate percentage to one decimal place", () => {
      const battery: BatteryMetrics = {
        ...perfectBattery,
        original_capacity_kwh: 85,
        current_capacity_kwh: 63.4,
      };
      // 63.4 / 85 * 100 = 74.588... -> round to 74.6
      expect(sohPercent(battery)).toBe(74.6);
    });
  });
});
