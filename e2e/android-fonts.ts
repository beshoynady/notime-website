import { readFileSync } from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";

/**
 * A device without Arial, as an Android phone resolves the site's fonts: local("Arial") misses, and
 * the Roboto and Noto Naskh Arabic local() sources are served from OFL subsets
 * (e2e/fixtures/android-fonts). Shared by android-font.spec (a Pixel) and cls.spec (on the Linux CI
 * runner, which has neither Arial nor Roboto, so a desktop there stands for any Arial-less device).
 */
const FIXTURES = path.join(__dirname, "fixtures", "android-fonts");
/** Inline, so they are ready at the first paint, as a phone's own system faces are (a url() face
 *  would load late and was not even fetched during the swap). */
const inline = (file: string) => `url(data:font/woff2;base64,${readFileSync(path.join(FIXTURES, file)).toString("base64")})`;
const ROBOTO = inline("roboto.woff2");
const NASKH = inline("noto-naskh-arabic.woff2");

/**
 * A src list of local() faces, quoted or not (the build's minifier drops the quotes), and with the
 * quotes escaped where the CSS also sits in a script string (the page's RSC payload).
 */
const q = '(?:\\\\?")?';
const locals = (...names: string[]) => new RegExp(names.map((n) => `local\\(\\s*${q}${n}${q}\\s*\\)`).join("\\s*,\\s*"), "g");

/** The site's CSS as a Pixel resolves it: no Arial; Roboto and Naskh from the fixtures. Quote-free. */
export function asAndroid(css: string) {
  return css
    .replace(locals("Arial"), "local(nt-no-arial-on-android)")
    .replace(locals("Roboto", "Roboto Regular", "Roboto-Regular"), ROBOTO)
    .replace(locals("Noto Naskh Arabic", "Noto Naskh Arabic Regular", "NotoNaskhArabic-Regular"), NASKH);
}

/**
 * Route the page's documents and stylesheets through asAndroid. Call before the first goto.
 * A phone's system faces are there at the first layout; an inline face still loads when a rule first
 * needs it, and a face only the hero title needs (the Arabic one) laid the title out in the default
 * serif for a few hundred ms, a shift no phone makes. So both files load at document start, and the
 * CSS faces find them ready.
 */
export async function emulateAndroidFonts(page: Page) {
  await page.addInitScript((sources: string[]) => {
    (window as unknown as { __androidFonts: FontFace[] }).__androidFonts = sources.map((src) => {
      const face = new FontFace("nt-android-warm", src);
      void face.load();
      return face;
    });
  }, [ROBOTO, NASKH]);
  // The CSS is inlined in the documents; a stylesheet, where there is one, gets the same.
  await page.route("**/*", async (route) => {
    const type = route.request().resourceType();
    if (type !== "document" && type !== "stylesheet") return route.fallback();
    const response = await route.fetch();
    const headers = { ...response.headers() };
    delete headers["content-length"];
    delete headers["content-encoding"];
    const text = await response.text();
    // In a document, only the <style> blocks: the RSC payload's text rows carry their own
    // byte lengths, and an edit there breaks hydration.
    const body = type === "stylesheet" ? asAndroid(text) : text.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, (block) => asAndroid(block));
    await route.fulfill({ status: response.status(), headers, body });
  });
}
