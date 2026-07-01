/**
 * BrandMark
 * Abstract Helpchain identity mark — concentric rings referencing the help action.
 */

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: { outer: "w-14 h-14", mid: "w-10 h-10", core: "w-5 h-5" },
  md: { outer: "w-20 h-20", mid: "w-14 h-14", core: "w-8 h-8" },
  lg: { outer: "w-24 h-24", mid: "w-[4.5rem] h-[4.5rem]", core: "w-10 h-10" },
};

export function BrandMark({ size = "md", className = "" }: BrandMarkProps) {
  const sizes = SIZE_MAP[size];

  return (
    <div
      className={["relative flex items-center justify-center", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <div
        className={`absolute ${sizes.outer} rounded-full border-2 border-[var(--hc-help-red)] opacity-20`}
      />
      <div
        className={`absolute ${sizes.mid} rounded-full border-2 border-[var(--hc-help-red)] opacity-40`}
      />
      <div className={`${sizes.core} rounded-full bg-[var(--hc-help-red)] shadow-[var(--hc-shadow-glow-red)]`} />
    </div>
  );
}
