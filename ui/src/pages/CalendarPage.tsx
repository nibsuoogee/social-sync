import { CalendarComponent } from "@/components/CalendarComponent";
import { calendarService } from "@/services/calendar";
import { Calendar, Event } from "@types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const CalendarPage = () => {
  const { calendar_id } = useParams();
  const [calendar, setCalendar] = useState<Calendar | undefined>(undefined);
  const [events, setEvents] = useState<Event[]>([]);

  const getEvents = async () => {
    if (typeof calendar_id === "undefined") return;

    const result = await calendarService.getCalendar(calendar_id);
    if (!result) return;

    setCalendar(result.calendar);
    setEvents(result.events);
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (!calendar) return <div>loading...</div>;

  const calendarHeader = `${
    calendar.is_group ? "Group calendar" : "Personal calendar"
  }: ${calendar.name}`;

  return (
    <div>
      <h1>{calendarHeader}</h1>
      {events.length > 0
        ? events.map((e, index) => (
            <div key={index}>
              {Object.values(e).map((v) => `${v} `)}
              <br />
            </div>
          ))
        : null}
      <div className="flex flex-col items-center">
        <CalendarComponent />
      </div>
    </div>
  );
};
