import { Resend } from "resend";

import { GetMailingList } from "@/lib/api/mailing-list/queries";

import ContactEmail from "@/components/email-templates/contact-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { data } = await request.json();

    const rawMailList = await GetMailingList();
    const mailingList = rawMailList.flatMap((item) => item.email);

    if (mailingList.length > 0) {
      const { data: contactEmail, error: contactEmailError } =
        await resend.emails.send({
          from: "Gurdwara Singh Sabha <no-reply@singhsabha.net>",
          to: mailingList,
          subject: `Recieved a new contact form submission: ${data.subject}`,
          react: ContactEmail({ data }),
        });

      if (contactEmailError) {
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
  } catch (err) {
    return Response.json(
      { error: "An unexpected error occurred while processing the request." },
      { status: 500 },
    );
  }
}
