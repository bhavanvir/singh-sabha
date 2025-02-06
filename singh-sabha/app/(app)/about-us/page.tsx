import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  ExternalLink,
  Users,
  ScrollText,
  BookMarked,
  ClipboardList,
  HandHelping,
} from "lucide-react";

export const metadata = {
  title: "About Us",
};

export default function History() {
  return (
    <div className="container mx-auto py-4 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold">Our History</h1>
      <div className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              The Akal Takht Sahib Directive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              On April 20, 1998, a significant meeting was held at the Akal
              Takht Sahib in Amritsar, led by Jathedar Bhai Ranjit Singh. This
              gathering resulted in a{" "}
              <Link
                href="https://singhsabha.net/documents/1998_langar_hukamnama.pdf"
                className="text-primary hover:underline inline-flex items-center"
                target="_blank"
              >
                Hukamnama
                <ExternalLink className="ml-1 h-4 w-4" />
              </Link>{" "}
              (official edict) that reaffirmed a core Sikh tradition: Langar,
              the free community meal served in every Gurdwara, should be eaten
              while sitting on the floor.
            </p>
            <p>
              This practice embodies two essential Sikh principles—humility and
              equality—ensuring that everyone, regardless of background, sits
              and eats together as equals.
            </p>
            <p>
              While this edict didn&apos;t change the Sikh Code of Conduct
              (Rehat Maryada), it clarified its application, reinforcing the
              importance of this tradition in honoring Sikh values.
            </p>
            <p>
              Today, over 99% of the world&apos;s 20,000+ Gurdwaras have
              embraced this directive, making it a unifying practice for the
              global Sikh community.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              Gurdwara Singh Sabha Victoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Established in 1999, Gurdwara Singh Sabha in Victoria is a
              non-profit organization dedicated to promoting Sikh principles and
              providing spiritual, social, and educational support to the
              community.
            </p>
            <p>
              Guided by the Akal Takht Sahib directive, the Gurdwara focuses on
              serving the needs of the Sikh community, especially those who are
              vulnerable, isolated, or at risk.
            </p>
            <p>
              Through services such as langar, a communal meal embodying the
              Sikh value of equality, and educational programs in Sikh
              spirituality, ethics, and culture, the Gurdwara fosters unity,
              guidance, and a deeper connection to Sikh teachings.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              Our Guiding Principles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <HandHelping className="mr-2" />
                    Langar Tradition
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Communal meals are served and eaten while seated on a matted
                  floor. All participants must have their heads covered and
                  shoes removed as a mark of respect.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <ScrollText className="mr-2" />
                    Authority and Code of Conduct
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We recognize the supreme authority of Akal Takht Sahib and
                  adhere to the Panth-approved Sikh Rehat Maryada (Code of
                  Conduct).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Users className="mr-2" />
                    Promotion of Sikhism
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We actively promote Sikhism through Amrit Sanchar (Sikh
                  baptism ceremony), youth programs, and other Gurmat (spiritual
                  and religious) activities.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <BookMarked className="mr-2" />
                    Guidelines for Preaching
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  All Katha (spiritual discourse), Kirtan (hymn singing), or
                  other teachings must be conducted by individuals who maintain
                  Sikhi Saroop, with exceptions for educational purposes during
                  youth programs.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <ClipboardList className="mr-2" />
                    Duties in Attendance of Guru Granth Sahib Ji
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Responsibilities such as performing Akhand Path or Sehaj Path
                  must be carried out exclusively by Amritdhari Sikhs (baptized
                  Sikhs).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
