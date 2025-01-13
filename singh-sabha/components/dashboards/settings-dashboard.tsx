"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { User, Mail, Calendar, Bell, FileText, Users } from "lucide-react";

import { cn } from "@/lib/utils";

import AccountSettingsCard from "@/components/cards/admin-dashboard/account-settings-card";
import UserManagementCard from "@/components/cards/admin-dashboard/user-management-card";
import MailingListCard from "@/components/cards/admin-dashboard/mailing-list-card";
import EventTypeManagementCard from "@/components/cards/admin-dashboard/event-type-management-card";
import AnnouncementManagementCard from "@/components/cards/admin-dashboard/announcement-management-card";
import EventManagementCard from "@/components/cards/admin-dashboard/event-management-card";

import {
  User as UserType,
  MailingList,
  EventType,
  Announcement,
  EventWithType,
} from "@/db/schema";

interface SettingsProps {
  user: UserType;
  users: Omit<UserType, "passwordHash">[];
  mailingList: MailingList[];
  events: EventWithType[];
  eventTypes: EventType[];
  announcements: Announcement[];
}

export default function SettingsDashboard({
  user,
  users,
  mailingList,
  events,
  eventTypes,
  announcements,
}: SettingsProps) {
  const sections = [
    {
      title: "Account",
      icon: <User size={20} />,
      content: <AccountSettingsCard user={user} />,
    },
    {
      title: "Mailing List",
      icon: <Mail size={20} />,
      content: <MailingListCard mailingList={mailingList} />,
    },
    {
      title: "Event Types",
      icon: <Calendar size={20} />,
      content: <EventTypeManagementCard eventTypes={eventTypes} />,
    },
    {
      title: "Announcements",
      icon: <Bell size={20} />,
      content: <AnnouncementManagementCard announcements={announcements} />,
    },
    {
      title: "Events",
      icon: <FileText size={20} />,
      content: <EventManagementCard events={events} />,
    },
    ...(user?.isAdmin
      ? [
          {
            title: "User Management",
            icon: <Users size={20} />,
            content: <UserManagementCard users={users} />,
          },
        ]
      : []),
  ];

  const [activeSection, setActiveSection] = React.useState(sections[0].title);

  const currentSection = sections.find(
    (section) => section.title === activeSection,
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <nav className="w-16 sm:w-64 bg-accent flex flex-col p-2 sm:p-4">
        <h2 className="hidden sm:block text-lg font-bold mb-4">Settings</h2>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.title}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full text-left justify-start",
                  activeSection === section.title
                    ? "bg-foreground text-background"
                    : "hover:bg-foreground hover:text-background",
                  { "pointer-events-none": activeSection === section.title },
                )}
                onClick={() => setActiveSection(section.title)}
              >
                {section.icon}
                <span className="hidden sm:block">{section.title}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <ScrollArea className="flex-grow p-4 sm:p-6">
        {currentSection ? (
          <div className="h-full">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">
              {currentSection.title}
            </h1>
            {currentSection.content}
          </div>
        ) : (
          <p className="text-gray-500">Select a section to view details.</p>
        )}
      </ScrollArea>
    </div>
  );
}
