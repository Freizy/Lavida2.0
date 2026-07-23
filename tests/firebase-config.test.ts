import { describe, it, expect } from "vitest";

describe("Firebase Config", () => {
  it("exports isFirebaseAuthConfigured as boolean", async () => {
    const { isFirebaseAuthConfigured } = await import("@/firebase/config");
    expect(typeof isFirebaseAuthConfigured).toBe("boolean");
  });

  it("exports firebaseConfig object", async () => {
    const { firebaseConfig } = await import("@/firebase/config");
    expect(firebaseConfig).toBeDefined();
    expect(firebaseConfig).toHaveProperty("apiKey");
    expect(firebaseConfig).toHaveProperty("authDomain");
    expect(firebaseConfig).toHaveProperty("projectId");
  });

  it("exports auth status message", async () => {
    const { firebaseAuthStatusMessage } = await import("@/firebase/config");
    expect(typeof firebaseAuthStatusMessage).toBe("string");
    expect(firebaseAuthStatusMessage.length).toBeGreaterThan(0);
  });
});
