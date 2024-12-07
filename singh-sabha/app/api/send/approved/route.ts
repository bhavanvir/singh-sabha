import { Resend } from "resend";

import ApprovedEventEmail from "@/components/email-templates/approved-event-email";
import { GetEventType } from "@/lib/api/event-types/queries";

import type { Event } from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const event: Event = await request.json();

    if (
      !event.registrantEmail ||
      !event.registrantFullName ||
      !event.occassion ||
      !event.start ||
      !event.end
    ) {
      return Response.json(
        { error: "Missing required data for sending emails." },
        { status: 400 },
      );
    }

    const eventType = await GetEventType({ id: event.type });

    const { data: userEmailData, error: userEmailError } =
      await resend.emails.send({
        from: "Gurdwara Singh Sabha <no-reply@singhsabha.net>",
        to: event.registrantEmail,
        subject: "Your event request has been approved!",
        react: ApprovedEventEmail({
          registrantFullName: event.registrantFullName,
          type: eventType ?? event.type,
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
