import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { CATEGORY_GRADE, sceneImageFile } from "@/lib/grade";
import { getCategories } from "..";
import { DRAFT_SCENE, getScene, getSceneImage, SCENE_IMAGES, type SceneImageSlot } from ".";

/** Scene layer slots (Task 2.10; layers.md): data, sources, native sizes and the mobile budget. */
sharp.cache(false);
const MOBILE_BUDGET = 600 * 1024;
const disk = (url: string) => path.join(process.cwd(), "public", url);
/** Every file a slot names, with the size its slot claims. */
type SlotFile = { src: string | null; width?: number; height?: number };
const files = (s: SceneImageSlot) =>
  ([{ src: s.src, width: s.width, height: s.height }, ...(s.mobile ? [s.mobile] : [])] as SlotFile[]).flatMap((f) =>
    f.src ? [{ ...f, src: f.src }] : [],
  );

describe("scene image slots", () => {
  it("match docs/design/storyboards/layers.md one to one", () => {
    const doc = readFileSync(path.join(process.cwd(), "docs", "design", "storyboards", "layers.md"), "utf8");
    const rows = doc.split("\n").filter((l) => l.startsWith("| `"));
    const documented = rows.flatMap((l) => [...l.split("|")[1].matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1])).filter((id) => /^(ev|pg|mb|cp)-/.test(id));
    expect(new Set(SCENE_IMAGES.map((s) => s.id)).size, "duplicate ids").toBe(SCENE_IMAGES.length);
    expect(SCENE_IMAGES.map((s) => s.id).sort()).toEqual(documented.sort());
  });

  it("carry their category's grade", () => {
    for (const s of SCENE_IMAGES) expect(s.grade, s.id).toBe(CATEGORY_GRADE[s.category]);
  });

  it("name a source that exists: a curated real photo (D49), or the AI image they re-use", () => {
    for (const s of SCENE_IMAGES) {
      if (s.source.kind === "real") {
        const group = s.source.from.replace(/-\d+$/, "");
        expect(existsSync(disk(`images/work/${group}/${s.source.from}.webp`)), `${s.id} ← ${s.source.from}`).toBe(true);
      } else if (s.source.from) {
        expect(existsSync(disk(`images/ai/${s.source.from}.webp`)), `${s.id} ← ${s.source.from}`).toBe(true);
      }
    }
  });

  it("are decorative unless they show real work as evidence", () => {
    for (const s of SCENE_IMAGES.filter((s) => s.alt)) {
      expect(s.source.kind, `${s.id} has alt text`).toBe("real");
      expect(s.alt!.en.trim() && s.alt!.ar.trim(), s.id).toBeTruthy();
    }
  });

  it("live at public/images/scenes/<category>/<slot>.webp (the 9:16 plate at <slot>-9x16)", () => {
    for (const s of SCENE_IMAGES) {
      if (s.src) expect(`public${s.src}`, s.id).toBe(sceneImageFile(s.category, s.id, "webp"));
      if (s.mobile?.src) expect(`public${s.mobile.src}`, s.id).toBe(sceneImageFile(s.category, `${s.id}-9x16`, "webp"));
    }
  });

  it("state the native size of every file they have (D51)", async () => {
    for (const s of SCENE_IMAGES) {
      for (const f of files(s)) {
        expect(existsSync(disk(f.src)), f.src).toBe(true);
        const meta = await sharp(readFileSync(disk(f.src))).metadata();
        expect([f.width, f.height], f.src).toEqual([meta.width, meta.height]);
      }
    }
  });

  it("look up by id", () => {
    expect(getSceneImage("ev-open-hall")?.category).toBe("events-hospitality");
    expect(getSceneImage("nope")).toBeUndefined();
  });
});

describe("scene layers and their images", () => {
  const scenes = [DRAFT_SCENE, ...getCategories().flatMap((c) => getScene(c.slug) ?? [])];

  it("every image layer names a scene slot", () => {
    for (const scene of scenes) {
      for (const layer of scene.layers.filter((l) => l.slot)) expect(getSceneImage(layer.slot!), `${scene.id} › ${layer.id}`).toBeDefined();
    }
  });

  it("each opening's mobile layers stay within 600 KB on disk", () => {
    for (const scene of scenes) {
      const bytes = scene.layers
        .filter((l) => l.mobile && l.slot)
        .map((l) => getSceneImage(l.slot!)!)
        .map((s) => (s.mobile ? s.mobile.src : s.src))
        .filter((src): src is string => src !== null)
        .reduce((sum, src) => sum + statSync(disk(src)).size, 0);
      expect(bytes, scene.id).toBeLessThanOrEqual(MOBILE_BUDGET);
    }
  });
});
