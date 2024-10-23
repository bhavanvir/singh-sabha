import * as React from "react";
import { format } from "date-fns";
import {
  Calendar,
  CalendarCheck2,
  CalendarX2,
  Clock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { typeEventMap } from "@/lib/types/eventdetails";

import type { Event } from "@/lib/types/event";

interface ConflictingEvent extends Event {
  conflict: boolean;
}

interface NotificationsProps {
  notifications: ConflictingEvent[];
}

export default function Notifications({ notifications }: NotificationsProps) {
  const formatEventTime = (event: Event) => {
    if (event.allDay) {
      return "All Day";
    }
    return `${format(event.start, "HH:mm")} - ${format(event.end, "HH:mm")}`;
  };

  return (
    <ScrollArea className="h-[calc(100vh-6rem)] mx-auto w-1/2 p-2 flex justify-center items-center">
      <div className="space-y-4 w-full">
        {notifications.map((notification) => (
          <div key={notification.id} className="w-full">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    style={{
                      backgroundColor: `${typeEventMap[notification.type].colour}`,
                    }}
                  >
                    {typeEventMap[notification.type].displayName}
                  </Badge>
                  <div>
                    {notification.conflict ? (
                      <CalendarX2 className="h-5 w-5 text-red-500" />
                    ) : (
                      <CalendarCheck2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {notification.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {format(notification.start, "LLL dd, y")} -{" "}
                    {format(notification.end, "LLL dd, y")}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{formatEventTime(notification)}</span>
                </div>
                {notification.registrantFullName && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User className="h-4 w-4 mr-2" />
                    <span>{notification.registrantFullName}</span>
                  </div>
                )}
                {notification.registrantEmail && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{notification.registrantEmail}</span>
                  </div>
                )}
                {notification.registrantPhoneNumber && (
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{notification.registrantPhoneNumber}</span>
                  </div>
                )}
                {notification.note && (
                  <p className="text-sm text-gray-600 mt-2">
                    {notification.note}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
