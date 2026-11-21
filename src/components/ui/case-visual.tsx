import { ServiceDrawing } from "@/components/category/service-drawings";
import { GeometricPattern } from "@/components/ornaments/geometric-pattern";
import type { DrawingKey } from "@/content/service-visuals";
import "./case-visual.css";

/**
 * The media of an anonymised case (D106): no photo may stand in for a real NO TIME project, so
 * until the client approves its name (and its own photos), the case shows a drawing of the work,
 * in the house style: espresso ground, a warm light falling from the top, the Gulf tile at a
 * whisper, and the hairline drawing (service-drawings.tsx) in champagne. Decorative: the card's
 * title names the case. Fills its `position: relative` parent.
 */
export function CaseVisual({ drawing }: { drawing: DrawingKey }) {
  return (
    <div className="case-visual" aria-hidden="true" data-drawing={drawing}>
      <GeometricPattern opacity={0.06} />
      <span className="case-visual-light" />
      <ServiceDrawing drawing={drawing} className="case-visual-drawing" />
    </div>
  );
}
