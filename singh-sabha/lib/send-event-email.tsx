import type { Event } from "@/db/schema";

export async function sendEventEmails(
  newEvent: Omit<Event, "id">,
  endpoint: string,
): Promise<void> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send confirmation emails");
    }
  } catch (error) {
    throw error;
  }
}
