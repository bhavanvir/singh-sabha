import { Resend } from "resend";
import EventConfirmationEmail from "@/components/email-templates/event-confirmation-email";
import SuperuserEventNotificationEmail from "@/components/email-templates/superuser-event-notification-email";
import { GetMailingList } from "@/lib/api/mailing-list/queries";

import type { Event } from "@/db/schema";
import { GetEventType } from "@/lib/api/event-types/queries";

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
        subject: `Event Confirmation: ${event.occassion}`,
        react: EventConfirmationEmail({
          registrantFullName: event.registrantFullName,
          type: eventType ?? event.type,
          start: event.start,
          end: event.end,
          occassion: event.occassion,
        }),
      });

    if (userEmailError) {
      return Response.json(
        { error: "Failed to send confirmation email to user." },
        { status: 500 },
      );
    }

    const rawMailList = await GetMailingList();
    const mailingList = rawMailList.flatMap((item) => item.email);

    if (mailingList.length > 0) {
      const { data: superUserData, error: superUserEmailError } =
        await resend.emails.send({
          from: "Gurdwara Singh Sabha <no-reply@singhsabha.net>",
          to: mailingList,
          subject: `New Event Request: ${event.occassion}`,
          react: SuperuserEventNotificationEmail({
            registrantFullName: event.registrantFullName,
            registrantEmail: event.registrantEmail,
            registrantPhoneNumber: event.registrantPhoneNumber,
            type: eventType ?? event.type,
            start: event.start,
            end: event.end,
            occassion: event.occassion,
            note: event.note,
            isPublic: event.isPublic,
          }),
        });

      if (superUserEmailError) {
        return Response.json(
          { error: "Failed to send confirmation email to super user(s)." },
          { status: 500 },
        );
      }
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
