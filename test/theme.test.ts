import { describe, expect, it } from "vitest";
import { nextTheme, resolveTheme, themeInitScript } from "#shared/utils/theme";

describe("resolveTheme", () => {
  it("prefers a valid stored value, otherwise the system preference", () => {
    expect(resolveTheme("dark", "light")).toBe("dark");
    expect(resolveTheme("light", "dark")).toBe("light");
    expect(resolveTheme(null, "dark")).toBe("dark");
    expect(resolveTheme("bogus", "light")).toBe("light");
  });
});

describe("nextTheme", () => {
  it("toggles", () => {
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("light");
  });
});

describe("themeInitScript", () => {
  it("reads the same storage key and sets data-theme inline", () => {
    expect(themeInitScript).toContain("localStorage.getItem('theme')");
    expect(themeInitScript).toContain("dataset.theme");
    expect(themeInitScript).toContain("prefers-color-scheme");
  });
});
