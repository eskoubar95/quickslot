import { Code2 } from "lucide-react";
import Link from "next/link";
import { SlotBooking } from "@/components/slot-booking";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.75_0.12_250/0.25),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.45_0.15_250/0.2),transparent)]"
        aria-hidden
      />
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-sm font-semibold tracking-tight">QuickSlot</span>
          <Link
            href="https://github.com/eskoubar95/quickslot"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Code2 className="size-4" aria-hidden />
            GitHub
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 sm:py-16">
        <section className="max-w-2xl space-y-4">
          <p className="text-primary text-sm font-medium tracking-wide uppercase">
            Demo · Next.js · Prisma · Railway
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Book et tidsrum på få sekunder
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
            Et lille bookingsystem til kurset: PostgreSQL på Railway, CI på GitHub,
            og et UI du gerne vil vise frem.
          </p>
        </section>

        <SlotBooking />
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        <p>
          QuickSlot · In-memory/session demo med persistens i Postgres ·{" "}
          <Link
            href="https://railway.app"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Railway
          </Link>
        </p>
      </footer>
    </div>
  );
}
