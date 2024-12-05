import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
} from "@react-email/components";
import { format } from "date-fns";

import type { Event } from "@/db/schema";

export default function SuperuserEventNotificationEmail({
  registrantFullName,
  registrantEmail,
  registrantPhoneNumber,
  type,
  start,
  title,
  note,
  isPublic,
}: Partial<Event>) {
  return (
    <Html>
      <Head />
      <Preview>New event request: {title!}</Preview>
      <Tailwind>
        <Body className="bg-background font-sans">
          <Container className="mx-auto my-8 p-8 max-w-xl">
            <Heading className="text-3xl font-bold text-foreground mb-6">
              New Event Request
            </Heading>
            <Text className="text-muted-foreground mb-6">
              A new event request has been submitted and requires your review.
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
                </Text>
                <Text className="text-sm text-card-foreground">
                  <span className="font-medium">Public:</span>{" "}
                  {isPublic ? "Yes" : "No"}
                </Text>
              </div>
            </Section>
            <Section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
              <Text className="text-lg font-semibold text-card-foreground mb-4">
                Registrant Details
              </Text>
              <div className="space-y-2">
                <Text className="text-sm text-card-foreground">
                  <span className="font-medium">Name:</span>{" "}
                  {registrantFullName}
                </Text>
                <Text className="text-sm text-card-foreground">
                  <span className="font-medium">Email:</span> {registrantEmail}
                </Text>
                {registrantPhoneNumber && (
                  <Text className="text-sm text-card-foreground">
                    <span className="font-medium">Phone:</span>{" "}
                    {registrantPhoneNumber}
                  </Text>
                )}
              </div>
            </Section>
            {note && (
              <Section className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
                <Text className="text-lg font-semibold text-card-foreground mb-2">
                  Additional Notes
                </Text>
                <Text className="text-sm text-card-foreground">{note}</Text>
              </Section>
            )}
            <Text className="text-muted-foreground mb-4">
              Please review this event request and take appropriate action.
            </Text>
            <Link
              href="https://singhsabha.net/admin"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium inline-block"
            >
              Review Event
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
