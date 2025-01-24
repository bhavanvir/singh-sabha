import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Tailwind,
  Img,
  Link,
} from "@react-email/components";
import type { ContactMessage } from "@/lib/types/contact-message";

export default function ContactEmail({ data }: { data: ContactMessage }) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission received</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-8 px-4 max-w-xl">
            <Heading className="text-2xl font-bold text-gray-800 my-8">
              New Contact Form Submission
            </Heading>
            <Text className="text-gray-700 text-base mb-6">
              A new message has been received through the contact form:
            </Text>
            <div className="bg-gray-100 rounded-md p-6 mb-6 border border-gray-200">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Contact Details
              </Text>
              <Text className="text-gray-700 text-sm mb-2">
                <span className="font-medium">Name:</span> {data.name}
              </Text>
              <Text className="text-gray-700 text-sm mb-2">
                <span className="font-medium">Email:</span> {data.email}
              </Text>
              <Text className="text-gray-700 text-sm mb-2">
                <span className="font-medium">Subject:</span> {data.subject}
              </Text>
            </div>
            <div className="bg-gray-100 rounded-md p-6 mb-6 border border-gray-200">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Message
              </Text>
              <Text className="text-gray-700 text-sm whitespace-pre-wrap">
                {data.message}
              </Text>
            </div>
            <Text className="text-gray-700 text-base mt-6 mb-6">
              Please respond to this inquiry as soon as possible.
            </Text>
            <Text className="text-gray-500 text-xs leading-relaxed mt-6">
              <Img
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/assets/singhsabha-logo.png`}
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
