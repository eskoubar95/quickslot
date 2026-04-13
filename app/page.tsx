import { SlotBooking } from "./components/slot-booking";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-16 sm:px-6">
        <header className="mb-10">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            QuickSlot
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Book en tid
          </h1>
        </header>
        <SlotBooking />
      </main>
    </div>
  );
}
