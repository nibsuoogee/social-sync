/**
 * List of calendars shown in the main menu.
 */

import { CalendarListElement } from "./CalendarListElement";
import { Calendar } from "@types";

export const CalendarList = ({
  calendars,
  onDelete,
}: {
  calendars: Calendar[];
  onDelete: (id: number) => void;
}) => {
  return (
    <div className="flex-1">
      {calendars.length !== 0
        ? calendars.map((calendar) => (
            <CalendarListElement
              key={calendar.id}
              calendar={calendar}
              onDelete={onDelete}
            />
          ))
        : "No calendars!"}
    </div>
  );
};
