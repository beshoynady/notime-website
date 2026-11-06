/**
 * Mutable state shared by reference between the hero canvas (reads it every frame),
 * the clock hand (handIntro) and GSAP (tweens it in the intro and scroll timelines).
 * Defaults are the hero's resting state.
 */
export type SceneState = {
  /** Atmosphere opacity 0–1 (intro fades it in). */
  alpha: number;
  /** Particle drift multiplier (scroll warp raises it). */
  speed: number;
  /** Radial spread of particles from the centre (scroll warp raises it). */
  spread: number;
  /** 0–1: the hand sweeps from 12 to the real second during the intro. */
  handIntro: number;
  /** Pointer position in −1…1 (0 = centre); mouse only. */
  pointer: { x: number; y: number };
};

export function createSceneState(): SceneState {
  return { alpha: 1, speed: 1, spread: 1, handIntro: 1, pointer: { x: 0, y: 0 } };
}
