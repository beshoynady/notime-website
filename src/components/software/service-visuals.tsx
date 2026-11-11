import type { ReactNode } from "react";

/**
 * One code-drawn visual per service (brief §C): a device frame, a flow, a storefront, a UI panel.
 * Decorative (aria-hidden): the block's text says what the service is. Lines marked
 * `data-sw-draw` draw on scroll (GSAP, software-motion.tsx); the hover/focus state change is CSS
 * on other elements (`.sw-block` :hover / :focus-within / [data-active], software.css), so no
 * element has two owners. No text inside: nothing to translate, nothing to mirror wrongly.
 */
function Frame({ kind, children }: { kind: string; children: ReactNode }) {
  return (
    <div className={`sw-v sw-v-${kind}`} aria-hidden="true">
      {children}
    </div>
  );
}

function Websites() {
  return (
    <Frame kind="web">
      <div className="sw-v-desk">
        <div className="sw-v-nav">
          <i className="sw-v-logo" />
          <span className="sw-v-links">
            <i />
            <i />
            <i />
          </span>
          <span className="sw-v-lang">
            <b />
          </span>
        </div>
        <div className="sw-v-site">
          <span className="sw-v-copy">
            <i className="sw-v-h" />
            <i />
            <i className="sw-v-short" />
            <i className="sw-v-btn" />
          </span>
          <span className="sw-v-img" />
        </div>
      </div>
      <div className="sw-v-mob">
        <i className="sw-v-h" />
        <i />
        <span className="sw-v-img" />
      </div>
    </Frame>
  );
}

function Apps() {
  return (
    <Frame kind="app">
      <div className="sw-v-phone">
        <div className="sw-v-screens">
          <span className="sw-v-screen">
            <i className="sw-v-h" />
            <i className="sw-v-tile" />
            <i className="sw-v-tile" />
          </span>
          <span className="sw-v-screen sw-v-screen-2">
            <i className="sw-v-h" />
            <i className="sw-v-cal" />
            <i className="sw-v-short" />
          </span>
        </div>
        <span className="sw-v-tabs">
          <i />
          <i />
          <i />
          <b className="sw-v-tab-on" />
        </span>
      </div>
      <svg className="sw-v-sync" viewBox="0 0 120 40" preserveAspectRatio="none">
        <path data-sw-draw="" pathLength={1} d="M4 20 C 40 2, 80 38, 116 20" />
      </svg>
      <div className="sw-v-web">
        <i className="sw-v-h" />
        <i />
        <i className="sw-v-short" />
      </div>
    </Frame>
  );
}

function Systems() {
  return (
    <Frame kind="sys">
      <svg className="sw-v-flowsvg" viewBox="0 0 300 160">
        {[30, 80, 130].map((y) => (
          <path key={`i${y}`} data-sw-draw="" pathLength={1} d={`M54 ${y} C 100 ${y}, 104 80, 130 80`} />
        ))}
        {[30, 80, 130].map((y) => (
          <path key={`o${y}`} data-sw-draw="" pathLength={1} d={`M170 80 C 196 80, 200 ${y}, 246 ${y}`} />
        ))}
        <g className="sw-v-pulse">
          {[30, 80, 130].map((y) => (
            <path key={`p${y}`} d={`M54 ${y} C 100 ${y}, 104 80, 130 80 M170 80 C 196 80, 200 ${y}, 246 ${y}`} />
          ))}
        </g>
        {[30, 80, 130].map((y) => (
          <rect key={`a${y}`} className="sw-v-in" x="10" y={y - 12} width="44" height="24" rx="3" />
        ))}
        <rect className="sw-v-core" x="130" y="52" width="40" height="56" rx="4" />
        {[30, 80, 130].map((y) => (
          <rect key={`b${y}`} className="sw-v-out" x="246" y={y - 12} width="44" height="24" rx="3" />
        ))}
      </svg>
    </Frame>
  );
}

function Commerce() {
  return (
    <Frame kind="shop">
      <div className="sw-v-store">
        <span className="sw-v-cart">
          <i className="sw-v-cart-0" />
          <i className="sw-v-cart-1" />
        </span>
        <div className="sw-v-products">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`sw-v-product${i === 1 ? " sw-v-product-pick" : ""}`}>
              <i className="sw-v-img" />
              <i />
              <i className="sw-v-add" />
            </span>
          ))}
        </div>
        <span className="sw-v-steps">
          <i className="is-on" />
          <i className="sw-v-step-2" />
          <i />
        </span>
      </div>
    </Frame>
  );
}

function Design() {
  return (
    <Frame kind="ux">
      <span className="sw-v-fid sw-v-fid-wire">
        <i />
        <i />
        <i />
      </span>
      <span className="sw-v-fid sw-v-fid-proto">
        <i />
        <i />
        <i />
      </span>
      <span className="sw-v-fid sw-v-fid-final">
        <i />
        <i />
        <i />
      </span>
    </Frame>
  );
}

function Ai() {
  return (
    <Frame kind="ai">
      <span className="sw-v-col sw-v-col-a">
        <b />
      </span>
      <span className="sw-v-col sw-v-col-b">
        <b />
      </span>
      {[0, 1, 2, 3].map((i) => (
        <i key={i} className={`sw-v-task sw-v-task-${i}`} />
      ))}
    </Frame>
  );
}

/** Event tech: a check-in counter (example data, labelled), a QR mark and a results screen. */
export function EventVisual({ label, of, example, total, exampleLabel }: { label: string; of: string; example: number; total: number; exampleLabel: string }) {
  return (
    <div className="sw-v sw-v-event" aria-hidden="true">
      <div className="sw-v-count">
        <span className="sw-v-count-label">{label}</span>
        <span className="sw-v-count-num tabular" dir="ltr">
          <b data-sw-count={example}>{example}</b>
          <span className="sw-v-count-of">
            {" "}
            {of} {total}
          </span>
        </span>
        <span className="sw-v-meter">
          <i data-sw-meter={example / total} style={{ transform: `scaleX(${example / total})` }} />
        </span>
        <span className="sw-tag sw-tag-dark">{exampleLabel}</span>
      </div>
      <div className="sw-v-qr" aria-hidden="true">
        {Array.from({ length: 25 }, (_, i) => (
          <i key={i} className={[0, 1, 3, 4, 5, 7, 9, 11, 12, 13, 15, 17, 19, 20, 21, 23, 24].includes(i) ? "on" : undefined} />
        ))}
      </div>
      <div className="sw-v-board" aria-hidden="true">
        {[0.92, 0.78, 0.64, 0.5].map((w, i) => (
          <span key={i} className="sw-v-board-row">
            <i className="sw-v-pos" />
            <i style={{ inlineSize: `${w * 100}%` }} />
          </span>
        ))}
      </div>
    </div>
  );
}

export const SERVICE_VISUALS: Record<string, () => ReactNode> = {
  websites: Websites,
  "mobile-apps": Apps,
  "custom-systems": Systems,
  "e-commerce": Commerce,
  "ui-ux-design": Design,
  "ai-consulting": Ai,
};
