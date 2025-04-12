import { CalendarComponent } from "@/components/CalendarComponent";
import { useEventsContext } from "@/contexts/EventsContext";
import { calendarService } from "@/services/calendar";
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import { Calendar } from "@types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const calendarTitle = (calendar: Calendar) => (
  <div className="flex items-center justify-start my-4 border-black gap-2">
    {calendar.is_group ? (
      <>
        <h3 className="font-mono">Group calendar: </h3>

        <UserGroupIcon
          className="size-6 ml-4"
          style={{ color: calendar.color }}
        />
      </>
    ) : (
      <>
        <h3 className="font-mono">Personal calendar: </h3>
        <UserIcon className="size-6 ml-2" style={{ color: calendar.color }} />
      </>
    )}
    <h3 className="font-mono">{calendar.name}</h3>
  </div>
);

export const CalendarPage = () => {
  const { calendar_id } = useParams();
  const { contextHandleSetEvents, contextHandleSetCalendar } =
    useEventsContext();
  const [calendar, setCalendar] = useState<Calendar | undefined>(undefined);
  //const [events, setEvents] = useState<Event[]>([]);

  const getEvents = async () => {
    if (typeof calendar_id === "undefined") return;

    const result = await calendarService.getCalendar(calendar_id);
    if (!result) return;

    setCalendar(result.calendar);
    //setEvents(result.events);
    contextHandleSetCalendar(result.calendar);
    contextHandleSetEvents(result.events);
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (!calendar) return <div>loading...</div>;

  return (
    <div className="flex flex-col items-center">
      {calendarTitle(calendar)}
      <CalendarComponent />
    </div>
  );
};
