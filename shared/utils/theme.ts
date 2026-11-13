export type Theme = "light" | "dark";

/** Prefer a valid stored preference; otherwise fall back to the system theme. */
export function resolveTheme(stored: string | null, system: Theme): Theme {
  return stored === "light" || stored === "dark" ? stored : system;
}

export function nextTheme(current: Theme): Theme {
  return current === "dark" ? "light" : "dark";
}

/**
 * Inline `<head>` script: applies the stored theme (or the system preference)
 * synchronously before the page paints, so there is no flash of the wrong
 * theme. It never writes to storage — only the explicit toggle persists.
 */
export const themeInitScript = `(function(){var stored=null;try{stored=localStorage.getItem('theme');}catch(e){}var theme=stored==='light'||stored==='dark'?stored:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;})();`;
