import AccountSettingsCard from "./cards/account-settings-card";
import UserManagementCard from "./cards/user-management-card";
import MailingListCard from "./cards/mailing-list-card";
import EventManagementCard from "./cards/event-management-card";
import AnnouncementManagementCard from "./cards/announcement-management-card";
import { User, MailingList, EventType, Announcement } from "@/db/schema";

interface SettingsProps {
  user: User;
  users: Omit<User, "passwordHash">[];
  mailingList: MailingList[];
  eventTypes: EventType[];
  announcements: Announcement[];
}

export default function Settings({
  user,
  users,
  mailingList,
  eventTypes,
  announcements,
}: SettingsProps) {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccountSettingsCard user={user} />
        <MailingListCard mailingList={mailingList} />
        <EventManagementCard eventTypes={eventTypes} />
        <AnnouncementManagementCard announcements={announcements} />
        {user?.isAdmin && <UserManagementCard users={users} />}
      </div>
    </div>
  );
}
