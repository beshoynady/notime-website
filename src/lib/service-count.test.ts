import { describe, expect, it } from "vitest";
import { services } from "@/content/services";
import { serviceCount } from "./service-count";

describe("serviceCount", () => {
  it("counts every service", () => {
    expect(serviceCount()).toBe(services.length);
    // Pins today's catalogue: fails loudly if a service is added without updating the copy check.
    expect(serviceCount()).toBe(30);
  });
});
