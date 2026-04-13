import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SlotBooking } from "./slot-booking";

const sampleSlots = [
  {
    id: "slot-1",
    start: "2030-06-01T09:00:00.000Z",
    end: "2030-06-01T09:30:00.000Z",
  },
];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("SlotBooking", () => {
  it("shows empty state when no slots", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ slots: [] }),
      }),
    );

    render(<SlotBooking />);

    await waitFor(() => {
      expect(screen.getByText(/ingen ledige tider/i)).toBeInTheDocument();
    });
  });

  it("books a slot with guest name and refreshes list", async () => {
    const user = userEvent.setup();

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ slots: sampleSlots }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          slot: sampleSlots[0],
          guestName: "Test Person",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ slots: [] }),
      });

    vi.stubGlobal("fetch", fetchMock);

    render(<SlotBooking />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /book/i })).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/navn/i), "Test Person");
    await user.click(screen.getByRole("button", { name: /^book$/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/slots",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            slotId: "slot-1",
            guestName: "Test Person",
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/ingen ledige tider/i)).toBeInTheDocument();
    });
  });
});
