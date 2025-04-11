/**
 * List of calendars shown in the main menu.
 */

import { CalendarListElement } from "./CalendarListElement";
import { Calendar } from "@types";

export const CalendarList = ({ calendars }: { calendars: Calendar[] }) => {
  return (
    <div className="flex-1">
      {calendars.length !== 0
        ? calendars.map((calendar) => (
            <CalendarListElement key={calendar.id} calendar={calendar} />
          ))
        : "No calendars!"}
    </div>
  );
};
