import type { EventWithType } from "@/db/schema";

export async function sendEventEmails(
  newEvent: EventWithType,
  endpoint: string,
): Promise<void> {
  try {
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });

    if (!resp.ok) {
      throw new Error("Failed to send email");
    }
  } catch (err) {
    throw new Error(`Came across an error when trying to send emails: ${err}`);
  }
}
