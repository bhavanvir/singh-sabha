"use client";

import * as React from "react";
import { AdminNavBar } from "./admin-navbar";
import BookingCalendar from "@/components/booking-calendar";
import Notifications from "@/components/admin-dashboard/notifications";
import Settings from "@/components/admin-dashboard/settings";
import AnalyticsDashboard from "@/components/admin-dashboard/analytics-dashboard";

import type {
  User,
  Event,
  MailingList,
  EventType,
  Announcement,
  EventWithType,
} from "@/db/schema";
import { Analytics } from "@/lib/types/analytics";

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
  events: Event[];
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
    (event: EventWithType) => event.isVerified && event.isDepositPaid,
  );

  const unverifiedEvents = events.filter(
    (event: EventWithType) =>
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
      <Settings
        user={user}
        users={users}
        mailingList={mailingList}
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
      <main className="flex-1 p-4">{pageComponents[activePage]}</main>
    </div>
  );
}
