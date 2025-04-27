import { VEvent } from "node-ical";
import { RRule } from "rrule";
import { EventDTO } from "../models/eventsModel";
import { tryCatch } from "@shared/src/tryCatch";
import { Event } from "../models/eventsModel";
import { Calendar } from "src/models/calendarModel";

export const filterUpcomingEvents = (events: VEvent[], daysAhead: number) => {
  const now = new Date();
  const maxDate = new Date();
  maxDate.setDate(now.getDate() + daysAhead);

  return events.filter((e) => {
    const start = new Date(e.start);
    return start >= now && start <= maxDate;
  });
};

export const addOrUpdateEvent = async (
  event: VEvent,
  calendarId: number,
  userId: number
) => {
  const existingEvent = await EventDTO.findByUidAndCalendar(
    event.uid,
    calendarId
  );
  if (existingEvent) {
    const dbEvent = existingEvent;
    const hasChanged =
      dbEvent.title !== event.summary ||
      dbEvent.description !== (event.description || "") ||
      dbEvent.location !== event.location ||
      dbEvent.start_time.getTime() !== new Date(event.start).getTime() ||
      dbEvent.end_time.getTime() !== new Date(event.end).getTime() ||
      (dbEvent.timezone || "UTC") !== ((event as any).timezone || "UTC") ||
      dbEvent.all_day !== !!(event.datetype === "date") ||
      (dbEvent.recurrence_rule || "") !== (event.rrule?.toString() || "");

    if (hasChanged) {
      const [updatedEvent, errUpdate] = await tryCatch(
        EventDTO.updateEvent(dbEvent.id, {
          title: event.summary,
          description: event.description || "",
          location: event.location || "",
          start_time: new Date(event.start),
          end_time: new Date(event.end),
          timezone: (event as any).timezone || "UTC",
          all_day: !!(event.datetype === "date"),
          recurrence_rule: event.rrule?.toString() || "",
          status: "confirmed",
        })
      );
      if (errUpdate) {
        console.error("Failed to update event:", errUpdate);
        return { updated: false, added: false };
      }
      return { updated: true, added: false };
    }
    return { updated: false, added: false };
  } else {
    const [newEvent, errNewEvent] = await tryCatch(
      EventDTO.createEvent({
        ics_uid: event.uid,
        calendar_id: calendarId,
        title: event.summary,
        description: event.description || "",
        location: event.location || "",
        start_time: new Date(event.start),
        end_time: new Date(event.end),
        timezone: (event as any).timezone || "UTC",
        all_day: !!(event.datetype === "date"),
        recurrence_rule: event.rrule?.toString() || "",
        status: "confirmed",
        proposed_by_user_id: userId,
        user_read_only: true,
      })
    );
    if (errNewEvent) {
      console.error("Failed to create event:", errNewEvent);
      return { updated: false, added: false };
    }

    return { updated: false, added: true };
  }
};

export const createIcsFile = (events: Event[], calendar: Calendar): string => {

    const fmt = (d: Date | null | undefined) => d ? new Date(d).toISOString().replace(/[-:]/g, "").split(".")[0] : "";
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "CALSCALE:GREGORIAN",
      `X-WR-CALNAME:${calendar.name}`,
      `X-WR-CALDESC:${calendar.description}`,
    ];
  
    events.forEach((event) => {
      lines.push(
        "BEGIN:VEVENT",
        `UID:${event.ics_uid}`,
        `SUMMARY:${event.title || ""}`,
        `DESCRIPTION:${event.description || ""}`,
        `LOCATION:${event.location || ""}`,
        `DTSTART:${fmt(event.start_time)}`,
        `DTEND:${fmt(event.end_time)}`,
        `STATUS:${event.status || ""}`,
        "END:VEVENT"
      );
    });
  
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  };
