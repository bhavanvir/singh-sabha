"use client";

import * as React from "react";

import { AdminNavBar } from "@/components/navbars/admin-navbar";
import BookingCalendar from "@/components/booking-calendar";
import Notifications from "@/components/notifications";
import SettingsDashboard from "@/components/dashboards/settings-dashboard";
import AnalyticsDashboard from "@/components/dashboards/analytics-dashboard";

import type {
  User,
  MailingList,
  EventType,
  Announcement,
  EventWithType,
} from "@/db/schema";
import { Analytics } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

const PAGES = {
  CALENDAR: "Calendar",
  NOTIFICATIONS: "Notifications",
  ANALYTICS: "Analytics",
  SETTINGS: "Settings",
} as const;

type PageKey = keyof typeof PAGES;

interface DashboardProps {
  user: User;
  users: Omit<User, "passwordHash">[];
  events: EventWithType[];
  mailingList: MailingList[];
  eventTypes: EventType[];
  announcements: Announcement[];
  analytics: Analytics;
}

export function AdminDashboard({
  user,
  users,
  events,
  mailingList,
  eventTypes,
  announcements,
  analytics,
}: DashboardProps) {
  const [activePage, setActivePage] = React.useState<PageKey>("CALENDAR");

  const verifiedEvents = events.filter(
    (event) => event.isVerified && event.isDepositPaid,
  );

  const unverifiedEvents = events.filter(
    (event) =>
      !verifiedEvents.some((verifiedEvent) => verifiedEvent.id === event.id),
  );

  const pageComponents = {
    CALENDAR: (
      <BookingCalendar user={user} events={events} eventTypes={eventTypes} />
    ),
    NOTIFICATIONS: (
      <Notifications
        unverifiedEvents={unverifiedEvents}
        verifiedEvents={verifiedEvents}
      />
    ),
    SETTINGS: (
      <SettingsDashboard
        user={user}
        users={users}
        mailingList={mailingList}
        events={events}
        eventTypes={eventTypes}
        announcements={announcements}
      />
    ),
    ANALYTICS: <AnalyticsDashboard analytics={analytics} />,
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminNavBar
        user={user}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <main
        className={cn("flex-1 h-full", activePage === "SETTINGS" ? "" : "p-4")}
      >
        {pageComponents[activePage]}
      </main>
    </div>
  );
}
