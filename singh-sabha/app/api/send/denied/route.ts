import { Resend } from "resend";

import DeniedEventEmail from "@/components/email-templates/denied-event-email";

import type { EventWithType } from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const event: EventWithType = await request.json();

    if (!event) {
      return Response.json(
        { error: "Missing required data for sending emails." },
        { status: 400 },
      );
    }

    const { data: userEmailData, error: userEmailError } =
      await resend.emails.send({
        from: "Gurdwara Singh Sabha <no-reply@singhsabha.net>",
        to: event.registrantEmail!,
        subject: "Update on your event request",
        react: DeniedEventEmail({
          registrantFullName: event.registrantFullName,
          type: event.eventType!.displayName,
          start: event.start,
          end: event.end,
          allDay: event.allDay,
          occassion: event.occassion,
        }),
      });

    if (userEmailError) {
      return Response.json(
        { error: "Failed to send confirmation email to user." },
        { status: 500 },
      );
    }

    return Response.json(
      { message: "Emails sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { error: "An unexpected error occurred while processing the request." },
      { status: 500 },
    );
  }
}
