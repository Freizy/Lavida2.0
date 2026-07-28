import { describe, it, expect } from "vitest";
import { escapeHtml } from "@/lib/generate-report";

describe("escapeHtml", () => {
  it("escapes ampersands", () => {
    expect(escapeHtml("A & B")).toBe("A &amp; B");
  });

  it("escapes angle brackets", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;"
    );
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('He said "hello"')).toBe("He said &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#039;s");
  });

  it("leaves normal text unchanged", () => {
    expect(escapeHtml("Normal text 123")).toBe("Normal text 123");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("handles mixed special characters", () => {
    expect(escapeHtml('<div class="x">A & B\'s "thing"</div>')).toBe(
      "&lt;div class=&quot;x&quot;&gt;A &amp; B&#039;s &quot;thing&quot;&lt;/div&gt;"
    );
  });
});
