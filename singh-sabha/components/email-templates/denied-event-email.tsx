import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Link,
  Tailwind,
  Img,
} from "@react-email/components";
import { format } from "date-fns";

import type { EventWithType } from "@/db/schema";

export default function DeniedEventEmail({ event }: { event: EventWithType }) {
  return (
    <Html>
      <Head />
      <Preview>Update on your event request</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-8 px-4 max-w-xl">
            <Heading className="text-2xl font-bold text-gray-800 my-8">
              Event Booking Update
            </Heading>
            <Text className="text-gray-700 text-base mb-6">
              Dear {event.registrantFullName}, we regret to inform you that we
              are unable to approve your event request at this time.
            </Text>
            <div className="bg-gray-100 rounded-lg p-6 mb-6 border border-gray-200">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                {event.occassion}
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
                <span className="font-medium">Time:</span>{" "}
                {event.allDay
                  ? "All Day"
                  : `${format(event.start, "h:mm a")} - ${format(event.end, "h:mm a")}`}
              </Text>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 mb-6 border border-gray-200">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Reference Number
              </Text>
              <Text className="text-gray-700 text-sm">
                <span className="font-medium">Event ID:</span> {event.id}
              </Text>
              <Text className="text-gray-500 text-xs mt-2">
                Please include this reference number in any communications about
                your event.
              </Text>
            </div>
            <Text className="text-gray-700 text-base mb-6">
              If you would like to discuss this further or have any questions,
              please don&apos;t hesitate to reach out to us.
            </Text>
            <Text className="text-gray-500 text-sm italic mt-6">
              Please note: This inbox is not monitored. If you have questions,
              contact our support team directly.
            </Text>
            <Text className="text-gray-500 text-xs leading-relaxed mt-6">
              <Img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/singhsabha-logo.png`}
                height="24"
                width="24"
                alt="Singh Sabha Logo"
                className="h-16 w-16"
              />
              <Link
                href="https://singhsabha.net/"
                target="_blank"
                className="text-blue-600 underline"
              >
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
