import { Resend } from "resend";

import ApprovedEventEmail from "@/components/email-templates/approved-event-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { data: event } = await request.json();
    if (!event) {
      return Response.json(
        { error: "Missing required data for sending emails." },
        { status: 400 },
      );
    }

    const stripeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/payment-intent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
        }),
      },
    );

    if (!stripeResponse.ok) {
      throw new Error("Failed to create Stripe session URL");
    }

    const { url } = await stripeResponse.json();

    const { data: userEmailData, error: userEmailError } =
      await resend.emails.send({
        from: "Gurdwara Singh Sabha <no-reply@singhsabha.net>",
        to: event.registrantEmail!,
        subject: "Your event request has been approved!",
        react: ApprovedEventEmail({ event, url }),
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
  } catch (err) {
    return Response.json(
      { error: "An unexpected error occurred while processing the request." },
      { status: 500 },
    );
  }
}
