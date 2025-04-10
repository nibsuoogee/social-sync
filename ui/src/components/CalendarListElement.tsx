/**
 * a single calendar list elements shown in the main menu.
 */
import { Card } from "@/components/ui/card";
import { UserIcon, UserGroupIcon } from "@heroicons/react/24/outline";

import { Calendar } from "../../types";

export const CalendarListElement = ({ calendar }: { calendar: Calendar }) => {
  return (
    <Card className="flex-row p-2 mb-2">
      {calendar.is_group ? (
        <UserGroupIcon
          className="size-6 ml-4"
          style={{ color: calendar.color }}
        />
      ) : (
        <UserIcon className="size-6 ml-4" style={{ color: calendar.color }} />
      )}
      <h3 className="font-mono">{calendar.name}</h3>
    </Card>
  );
};
