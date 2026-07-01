import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Surface } from "@/components/ui";

interface RoleCardProps {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
}

export function RoleCard({ title, description, href, cta, icon: Icon }: RoleCardProps) {
  return (
    <Surface
      elevation="raised"
      padding="lg"
      as="article"
      className="group h-full transition-colors hover:border-[var(--hc-violet)]/40"
    >
      <Link
        href={href}
        className={[
          "flex flex-col gap-[var(--hc-space-4)] h-full",
          "rounded-[var(--hc-radius-lg)]",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hc-violet)]",
        ].join(" ")}
      >
        <div
          className="flex items-center justify-center w-11 h-11 rounded-[var(--hc-radius-md)] bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]"
          aria-hidden="true"
        >
          <Icon size={22} strokeWidth={1.75} />
        </div>

        <div className="flex flex-col gap-[var(--hc-space-2)] flex-1">
          <h2 className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)] leading-tight">
            {title}
          </h2>
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] leading-relaxed">
            {description}
          </p>
        </div>

        <span
          className={[
            "inline-flex items-center gap-[var(--hc-space-2)]",
            "text-[var(--hc-text-sm)] font-semibold text-[var(--hc-violet)]",
            "min-h-[var(--hc-touch-min)] items-center",
          ].join(" ")}
        >
          {cta}
          <ArrowRight
            size={16}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </Link>
    </Surface>
  );
}
