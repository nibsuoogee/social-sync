/**
 * a single calendar list elements shown in the main menu.
 */
import { UserIcon, UserGroupIcon } from "@heroicons/react/24/outline";

import { Calendar } from "../../types";
import { Button } from "./ui/button";

export const CalendarListElement = ({ calendar }: { calendar: Calendar }) => {
  return (
    <Button
      variant={"outline"}
      className="w-full flex items-center justify-start mb-2  border-black"
    >
      {calendar.is_group ? (
        <UserGroupIcon
          className="size-6 ml-4"
          style={{ color: calendar.color }}
        />
      ) : (
        <UserIcon className="size-6 ml-2" style={{ color: calendar.color }} />
      )}
      <h3 className="font-mono">{calendar.name}</h3>
    </Button>
  );
};
