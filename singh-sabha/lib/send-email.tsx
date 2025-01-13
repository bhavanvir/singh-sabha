import type { EventWithType } from "@/db/schema";
import type { ContactMessage } from "./types/contact-message";

export async function sendEmail(
  data: EventWithType | ContactMessage,
  endpoint: string,
  additionalInfo?: string,
): Promise<void> {
  try {
    const payload = {
      data: data,
      additionalInfo: additionalInfo ?? undefined,
    };

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      throw new Error("Failed to send email");
    }
  } catch (err) {
    throw new Error(`Came across an error when trying to send emails: ${err}`);
  }
}
