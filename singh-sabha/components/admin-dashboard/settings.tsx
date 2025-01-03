import AccountSettingsCard from "@/components/cards/admin-dashboard/account-settings-card";
import UserManagementCard from "@/components/cards/admin-dashboard/user-management-card";
import MailingListCard from "@/components/cards/admin-dashboard/mailing-list-card";
import EventTypeManagementCard from "@/components/cards/admin-dashboard/event-type-management-card";
import AnnouncementManagementCard from "@/components/cards/admin-dashboard/announcement-management-card";
import EventManagementCard from "@/components/cards/admin-dashboard/event-management-card";
import {
  User,
  MailingList,
  EventType,
  Announcement,
  EventWithType,
} from "@/db/schema";

interface SettingsProps {
  user: User;
  users: Omit<User, "passwordHash">[];
  mailingList: MailingList[];
  events: EventWithType[];
  eventTypes: EventType[];
  announcements: Announcement[];
}

export default function Settings({
  user,
  users,
  mailingList,
  events,
  eventTypes,
  announcements,
}: SettingsProps) {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccountSettingsCard user={user} />
        <MailingListCard mailingList={mailingList} />
        <EventTypeManagementCard eventTypes={eventTypes} />
        <AnnouncementManagementCard announcements={announcements} />
        <EventManagementCard events={events} />
        {user?.isAdmin && <UserManagementCard users={users} />}
      </div>
    </div>
  );
}
