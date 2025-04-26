import { useCalendarListContext } from "@/contexts/CalendarListContext";
import { CalendarListElement } from "./CalendarListElement";

/**
 * List of calendars shown in the main menu.
 */
export const CalendarList = () => {
  const { contextCalendars } = useCalendarListContext();
  return (
    <div className="flex-1">
      {contextCalendars.length !== 0
        ? contextCalendars.map((calendar) => (
            <CalendarListElement key={calendar.id} calendar={calendar} />
          ))
        : "No calendars!"}
    </div>
  );
};
