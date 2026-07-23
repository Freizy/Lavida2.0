import { describe, it, expect } from "vitest";

describe("Placeholder Images", () => {
  it("exports PlaceHolderImages array", async () => {
    const { PlaceHolderImages } = await import("@/lib/placeholder-images");
    expect(Array.isArray(PlaceHolderImages)).toBe(true);
    expect(PlaceHolderImages.length).toBeGreaterThan(0);
  });

  it("each image has required fields", async () => {
    const { PlaceHolderImages } = await import("@/lib/placeholder-images");
    PlaceHolderImages.forEach((img) => {
      expect(img).toHaveProperty("id");
      expect(img).toHaveProperty("imageUrl");
      expect(img).toHaveProperty("imageHint");
      expect(typeof img.id).toBe("string");
      expect(typeof img.imageUrl).toBe("string");
      expect(typeof img.imageHint).toBe("string");
    });
  });

  it("finds loading-medical image", async () => {
    const { PlaceHolderImages } = await import("@/lib/placeholder-images");
    const loadingImg = PlaceHolderImages.find((img) => img.id === "loading-medical");
    expect(loadingImg).toBeDefined();
    expect(loadingImg?.imageUrl).toBeTruthy();
  });
});
