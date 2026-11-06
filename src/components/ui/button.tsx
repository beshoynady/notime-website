import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Buttons per the reference: 4px radius, uppercase tracked label (Arabic: none),
 * and a fill that rises from the bottom on hover/focus (CSS, 0.5s expo.out).
 */
export const buttonVariants = cva(
  [
    "group/btn relative isolate inline-flex items-center justify-center gap-3 overflow-hidden",
    "rounded-[var(--radius)] border font-medium uppercase no-underline select-none",
    "tracking-[0.18em] lang-ar:tracking-normal lang-ar:normal-case",
    "transition-[color,border-color] duration-300 ease-expo-out",
    "before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:content-['']",
    "before:transition-transform before:duration-500 before:ease-expo-out",
    "hover:before:scale-y-100 focus-visible:before:scale-y-100",
    "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        /** Champagne on dark grounds. */
        primary: "border-champagne bg-champagne text-espresso before:bg-ivory",
        /** Outline in the current text colour; fills champagne. */
        ghost: "border-current bg-transparent text-current before:bg-champagne hover:border-champagne hover:text-espresso focus-visible:text-espresso",
        /** Espresso on light grounds; fills cocoa. */
        dark: "border-espresso bg-espresso text-ivory before:bg-cocoa hover:border-cocoa",
      },
      size: {
        md: "min-h-12 px-[26px] py-[15px] text-[0.8rem] lang-ar:text-[0.95rem]",
        sm: "min-h-10 px-4 py-2.5 text-[0.68rem] lang-ar:text-[0.85rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

/** Directional arrow: flips in RTL, slides toward the reading direction on hover. */
export function ButtonArrow() {
  return (
    <ArrowRight
      aria-hidden="true"
      strokeWidth={1.25}
      className="size-4 shrink-0 transition-transform duration-500 ease-expo-out group-hover/btn:translate-x-[5px] rtl:-scale-x-100 rtl:group-hover/btn:-translate-x-[5px]"
    />
  );
}

interface CommonProps extends Variants {
  children: ReactNode;
  arrow?: boolean;
  className?: string;
}

export function Button({ children, arrow, variant, size, className, ...rest }: CommonProps & Omit<ComponentProps<"button">, "children">) {
  return (
    <button type="button" className={cn(buttonVariants({ variant, size }), className)} {...rest}>
      <span>{children}</span>
      {arrow && <ButtonArrow />}
    </button>
  );
}

export function ButtonLink({ children, arrow, variant, size, className, ...rest }: CommonProps & Omit<ComponentProps<typeof Link>, "children">) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...rest}>
      <span>{children}</span>
      {arrow && <ButtonArrow />}
    </Link>
  );
}
