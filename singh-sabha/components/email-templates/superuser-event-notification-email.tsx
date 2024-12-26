import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Tailwind,
  Link,
  Img,
} from "@react-email/components";
import { format } from "date-fns";

import type { EventWithType } from "@/db/schema";

export default function SuperuserEventNotificationEmail({
  event,
}: {
  event: EventWithType;
}) {
  return (
    <Html>
      <Head />
      <Preview>New event booking request: {event.occassion}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-8 px-4 max-w-xl">
            <Heading className="text-2xl font-bold text-gray-800 my-8">
              Event Booking Request
            </Heading>
            <Text className="text-gray-700 text-base mb-6">
              A new event booking request has been submitted and requires your
              review.
            </Text>
            <div className="bg-gray-100 rounded-lg p-6 mb-6 border border-gray-200">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                {event.occassion}
              </Text>
              <Text className="text-gray-700 text-sm mb-2">
                <span className="font-medium">Event ID:</span> {event.id}
              </Text>
              <Text className="text-gray-700 text-sm mb-2">
                <span className="font-medium">Type:</span>{" "}
                {event.eventType?.displayName}
              </Text>
              <Text className="text-gray-700 text-sm mb-2">
                <span className="font-medium">Date:</span>{" "}
                {format(event.start, "MMMM d, yyyy")}
                {format(event.start, "MMMM d, yyyy") !==
                  format(event.end, "MMMM d, yyyy") &&
                  ` - ${format(event.end, "MMMM d, yyyy")}`}
              </Text>
              <Text className="text-gray-700 text-sm">
                <span className="font-medium">Public:</span>{" "}
                {event.isPublic ? "Yes" : "No"}
              </Text>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 mb-6 border border-gray-200">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Registrant Details
              </Text>
              <Text className="text-gray-700 text-sm mb-2">
                <span className="font-medium">Name:</span>{" "}
                {event.registrantFullName}
              </Text>
              <Text className="text-gray-700 text-sm mb-2">
                <span className="font-medium">Email:</span>{" "}
                {event.registrantEmail}
              </Text>
              <Text className="text-gray-700 text-sm">
                <span className="font-medium">Phone:</span>{" "}
                {event.registrantPhoneNumber}
              </Text>
            </div>
            {event.note && (
              <div className="bg-gray-100 rounded-lg p-6 mb-6 border border-gray-200">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  Additional Notes
                </Text>
                <Text className="text-gray-700 text-sm">{event.note}</Text>
              </div>
            )}
            <Text className="text-gray-700 text-base mb-6">
              Please review this event request and take appropriate action.
            </Text>
            <Text className="text-gray-500 text-xs leading-relaxed mt-6">
              <Img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/singhsabha-logo.png`}
                height="24"
                width="24"
                alt="Singh Sabha Logo"
                className="h-16 w-16"
              />
              <Link href="https://singhsabha.net/" target="_blank">
                SinghSabha.net
              </Link>
              , serving the Sikh community with devotion and compassion.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
