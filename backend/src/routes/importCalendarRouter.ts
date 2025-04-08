import { Elysia } from "elysia";
import ical, { VEvent } from "node-ical";
import { sql } from "bun";

import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";

import { CalendarDTO } from "../models/calendarModel";
import { MembershipDTO } from "../models/membershipModel";
import { EventDTO } from "../models/eventsModel";
import { EventsCalendarsDTO } from "../models/eventsCalendarsModel";

import { getRandomColor } from "@shared/src/util/random";
import { tryCatch } from "@shared/src/tryCatch";

// This function is called when a user imports a calendar from a URL
// Function to create a new calendar for the user
// and add the user as a member with the owner role
// It creates a new calendar and adds the user as a member with the owner role
// It uses the CalendarDTO and MembershipDTO to create the calendar and membership   
async function createNewUserCalendar(userId: number) {

  const [calendar, errCalendar] = await tryCatch(
    CalendarDTO.createCalendar({
      name: "Imported Calendar",
      description: "My personal calendar",
      owner_user_id: userId,
      is_group: false,
      color: getRandomColor(),
    })
  );
  if (errCalendar) throw new Error(errCalendar.message);
    if (!calendar) throw new Error("Failed to create calendar");

  const [membership, errMembership] = await tryCatch(
    MembershipDTO.createMembership({
      calendar_id: calendar.id,
      user_id: userId,
      role: "owner",
      color: getRandomColor(),
    })
  );
if (errMembership) throw new Error(errMembership.message);
    if (!membership) throw new Error("Failed to create membership");

  return calendar.id;
}

export const calendarUrlImportRouter = new Elysia()
  .use(jwtConfig)
  .derive(authorizationMiddleware)
  .guard(
    {
      beforeHandle: ({ user, error }) => {
        if (!user) return error(401, "Not Authorized");
      },
    },
    (app) =>
      app.post("/calendar/import-url", async ({ user, body, error }) => {
        const {url} = body as { url?: string };

        if (!url || typeof url !== "string") {
          return error(400, "Missing or invalid URL");
        }

        try {
          const parsed = await ical.async.fromURL(url);
          const events = Object.values(parsed).filter(
            (e): e is VEvent => (e as any).type === "VEVENT"
          );
          const now = new Date();
          const maxDate = new Date();
          maxDate.setDate(now.getDate() + 90);

          const upcomingEvents = events.filter((e) => {
            const start = new Date(e.start);
            return start >= now && start <= maxDate;
          });

          const calendarId = await createNewUserCalendar(user.id);
          let importedCount = 0;

          for (const e of upcomingEvents) {
            const existing = await sql`
              SELECT e.id FROM events e
              JOIN events_calendars ec ON ec.events_id = e.id
              WHERE e.ics_uid = ${e.uid} AND ec.calendars_id = ${calendarId}
              LIMIT 1
            `;
            if (existing.length > 0) continue;

            const [event, errEvent] = await tryCatch(
              EventDTO.createEvent({
                ics_uid: e.uid,
                title: e.summary,
                description: e.description || "",
                location: e.location || "",
                start_time: e.start.toISOString(),
                end_time: e.end.toISOString(),
                timezone: (e as any).timezone || "UTC",
                all_day: !!(e.datetype === "date"),
                recurrence_rule: e.rrule?.toString() || undefined,
                status: "confirmed",
                proposed_by_user_id: user.id,
              })
            );
            if (errEvent || !event) {
                console.error(errEvent || "Failed to create event");
                continue;
              }

            const [linked, errLinked] = await tryCatch(
              EventsCalendarsDTO.linkEventToCalendar({
                events_id: event.id,
                calendars_id: calendarId,
              })
            );
            if (errLinked || !linked) {
                console.error(errLinked || "Failed to link event to calendar");
                continue;
              }
            importedCount++;
          }

          return {
            message: "Calendar imported",
            events: importedCount,
          };
        } catch (err) {
          console.error(err);
          return error(500, "Failed to fetch or parse calendar");
        }
      })
  );