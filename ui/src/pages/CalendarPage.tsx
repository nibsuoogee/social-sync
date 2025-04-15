import { CalendarComponent } from "@/components/calendar/CalendarComponent";
import { useEventsContext } from "@/contexts/EventsContext";
import { calendarService } from "@/services/calendar";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import { Calendar } from "@types";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const CalendarPage = ({
  allPersonalCalendars,
}: {
  allPersonalCalendars?: true;
}) => {
  const { calendar_id } = useParams();
  const { contextCalendarsAndEvents, contextHandleCalendarsAndEvents } =
    useEventsContext();

  async function getCalendarEvents() {
    if (typeof calendar_id === "undefined") return;

    const result = await calendarService.getCalendar(calendar_id);
    if (!result) return;

    contextHandleCalendarsAndEvents([result]);
  }

  async function getEventsAllCalendars() {
    const result = await calendarService.getAllPersonalCalendars();
    if (!result) return;

    contextHandleCalendarsAndEvents(result);
  }

  useEffect(() => {
    if (allPersonalCalendars) {
      getEventsAllCalendars();
    }

    getCalendarEvents();
  }, []);

  if (!contextCalendarsAndEvents[0]) return <div>loading...</div>;

  const calendarTitle = (calendar: Calendar) => {
    const textBeforeIcon =
      !calendar.is_group || allPersonalCalendars
        ? "Personal calendar"
        : "Group calendar";
    const CalendarIcon =
      !calendar.is_group || allPersonalCalendars ? UserIcon : UserGroupIcon;
    const calendarName = allPersonalCalendars ? "All calendars" : calendar.name;
    const calendarColor = allPersonalCalendars ? "#000000" : calendar.color;

    return (
      <div className="flex items-center justify-start my-4 border-black gap-2">
        <h3 className="font-mono">{`${textBeforeIcon}`}: </h3>
        <CalendarIcon
          className="size-6 ml-2"
          style={{ color: calendarColor }}
        />
        <h3 className="font-mono">{calendarName}</h3>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      {calendarTitle(contextCalendarsAndEvents[0].calendar)}
      <CalendarComponent />
    </div>
  );
};
