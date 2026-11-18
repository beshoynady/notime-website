/**
 * Service anchors that were renamed, old → new, so a link already shared keeps working: the hash
 * (`#print-store`) lands on the renamed section and `?service=print-store` still presets the brief.
 * D123: the print service is "Print ordering", so `print-store` became `print-ordering`. No imports,
 * so the client islands can use it without pulling in the content data.
 */
export const LEGACY_ANCHORS: Readonly<Record<string, string>> = { "print-store": "print-ordering" };

/** The anchor an id stands for today (itself when it was never renamed). */
export const currentAnchor = (id: string): string => (Object.hasOwn(LEGACY_ANCHORS, id) ? LEGACY_ANCHORS[id] : id);
