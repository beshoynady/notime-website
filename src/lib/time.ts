const p2 = (n: number) => String(n).padStart(2, "0");

/** Film timecode "TC HH:MM:SS:FF" for elapsed milliseconds (frames at `fps`). */
export function formatTimecode(elapsedMs: number, fps = 24): string {
  const ms = Math.max(0, elapsedMs);
  const s = Math.floor(ms / 1000);
  const frame = Math.floor(((ms % 1000) / 1000) * fps);
  return `TC ${p2(Math.floor(s / 3600))}:${p2(Math.floor(s / 60) % 60)}:${p2(s % 60)}:${p2(frame)}`;
}

/** Second-hand angle in degrees (0 = 12 o'clock), moving smoothly with milliseconds. */
export function secondHandAngle(d: Date): number {
  return (d.getSeconds() + d.getMilliseconds() / 1000) * 6;
}
