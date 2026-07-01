import { AppShell, PageContainer, ScreenReaderOnly } from "@/components/ui";
import { BrandMark } from "@/components/shared/brand-mark";
import { RoleCard, LANDING_COPY } from "@/components/landing";
import { HandHeart, Store, Users } from "lucide-react";

const ROLE_CARDS = [
  {
    ...LANDING_COPY.roles.requester,
    icon: HandHeart,
  },
  {
    ...LANDING_COPY.roles.volunteer,
    icon: Users,
  },
  {
    ...LANDING_COPY.roles.partner,
    icon: Store,
  },
] as const;

export default function HomePage() {
  return (
    <AppShell>
      <PageContainer maxWidth="lg" className="flex flex-col flex-1 justify-center">
        <div
          className="flex flex-col items-center gap-[var(--hc-space-10)] w-full"
          style={{
            animation: "hc-fade-up var(--hc-duration-slow) var(--hc-ease-out) both",
          }}
        >
          <header className="flex flex-col items-center gap-[var(--hc-space-5)] text-center max-w-2xl">
            <BrandMark size="lg" />
            <div className="flex flex-col gap-[var(--hc-space-3)]">
              <p className="text-[var(--hc-text-sm)] font-semibold tracking-[0.18em] uppercase text-[var(--hc-violet)]">
                Helpchain
              </p>
              <h1 className="text-[var(--hc-text-3xl)] sm:text-[var(--hc-text-4xl)] font-bold tracking-tight text-[var(--hc-text)] leading-[var(--hc-leading-tight)]">
                {LANDING_COPY.headline}
              </h1>
              <p className="text-[var(--hc-text-base)] sm:text-[var(--hc-text-lg)] text-[var(--hc-text-muted)] leading-[var(--hc-leading-relaxed)] max-w-xl mx-auto">
                {LANDING_COPY.description}
              </p>
            </div>
          </header>

          <section
            aria-labelledby="demo-roles-heading"
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-[var(--hc-space-4)]"
          >
            <h2 id="demo-roles-heading" className="sr-only">
              Open a demo surface
            </h2>
            {ROLE_CARDS.map((role) => (
              <RoleCard key={role.href} {...role} />
            ))}
          </section>

          <footer className="text-center pt-[var(--hc-space-2)]">
            <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)]">
              {LANDING_COPY.footer}
            </p>
          </footer>

          <ScreenReaderOnly>
            Local Helpchain prototype introduction. Choose requester, volunteer, or partner to
            begin the demonstration. Director controls are not linked from this page.
          </ScreenReaderOnly>
        </div>
      </PageContainer>
    </AppShell>
  );
}
