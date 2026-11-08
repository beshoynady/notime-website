/**
 * The active section for a scrollspy: the last one whose top (document px, ascending) is at or
 * above the line; -1 above the first section.
 */
export function activeIndex(tops: readonly number[], line: number): number {
  let i = -1;
  while (i + 1 < tops.length && tops[i + 1] <= line) i++;
  return i;
}
