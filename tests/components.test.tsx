import { describe, it, expect, vi } from "vitest";
import { escapeHtml } from "@/lib/generate-report";

describe("escapeHtml", () => {
  it("escapes < and >", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes &", () => {
    expect(escapeHtml("a&b")).toBe("a&amp;b");
  });

  it("escapes quotes and apostrophes", () => {
    expect(escapeHtml('"hello\'')).toBe("&quot;hello&#039;");
  });

  it("passes through safe strings unchanged", () => {
    expect(escapeHtml("Hello World 123")).toBe("Hello World 123");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("escapes multiple special chars in one string", () => {
    expect(escapeHtml('<b>"a" & \'b\'</b>')).toBe(
      "&lt;b&gt;&quot;a&quot; &amp; &#039;b&#039;&lt;/b&gt;"
    );
  });
});
