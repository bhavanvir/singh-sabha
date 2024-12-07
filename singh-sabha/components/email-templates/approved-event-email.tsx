import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Hr,
  Tailwind,
} from "@react-email/components";
import { format } from "date-fns";

import type { Event } from "@/db/schema";

export default function ApprovedEventEmail({
  registrantFullName,
  type,
  start,
  end,
  allDay,
  title,
}: Partial<Event>) {
  return (
    <Html>
      <Head />
      <Preview>Your event request has been approved!</Preview>
      <Tailwind>
        <Body className="bg-background font-sans">
          <Container className="mx-auto my-8 p-8 max-w-xl">
            <Heading className="text-3xl font-bold text-foreground mb-6">
              Event Approved
            </Heading>
            <Text className="text-muted-foreground mb-6">
              Dear {registrantFullName}, we&apos;re pleased to inform you that
              your event request has been approved.
            </Text>
            <Section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
              <Text className="text-lg font-semibold text-card-foreground mb-4">
                {title}
              </Text>
              <div className="space-y-2">
                <Text className="text-sm text-card-foreground">
                  <span className="font-medium">Type:</span> {type}
                </Text>
                <Text className="text-sm text-card-foreground">
                  <span className="font-medium">Date:</span>{" "}
                  {format(start!, "MMMM d, yyyy")}
                  {format(start!, "MMMM d, yyyy") !==
                    format(end!, "MMMM d, yyyy") &&
                    ` - ${format(end!, "MMMM d, yyyy")}`}
                </Text>
                <Text className="text-sm text-card-foreground">
                  <span className="font-medium">Time:</span>{" "}
                  {allDay
                    ? "All Day"
                    : `${format(start!, "h:mm a")} - ${format(end!, "h:mm a")}`}
                </Text>
              </div>
            </Section>
            <Text className="text-muted-foreground mb-4">
              If you need to make any changes or have any questions, please
              don&apos;t hesitate to contact us.
            </Text>
            <Link
              href="https://singhsabha.net/"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium inline-block"
            >
              Contact Us
            </Link>
            <Hr className="my-6 border-border" />
            <Text className="text-sm text-muted-foreground">
              <em>
                Please note: This inbox is not monitored. If you have questions,
                contact our support team directly.
              </em>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
