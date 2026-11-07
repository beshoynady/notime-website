import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  /** Help text, or the error message when `error` is set. */
  hint?: ReactNode;
  error?: boolean;
  className?: string;
  /** Render prop so inputs and selects share one label/hint wiring. */
  children: (control: { id: string; "aria-invalid"?: true; "aria-describedby"?: string; className: string }) => ReactNode;
}

/**
 * Underlined form field (reference: label in tracked caps, 1px bottom rule that darkens on
 * focus). An error turns the rule and the hint brick red and wires `aria-invalid` +
 * `aria-describedby`, so screen readers announce the message with the control.
 */
export function Field({ label, hint, error = false, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className={cn("field", error && "field-error", className)}>
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        className: "field-control",
        ...(error ? { "aria-invalid": true as const } : {}),
        ...(hintId ? { "aria-describedby": hintId } : {}),
      })}
      {hint && (
        <span id={hintId} className="field-hint">
          {hint}
        </span>
      )}
    </div>
  );
}
