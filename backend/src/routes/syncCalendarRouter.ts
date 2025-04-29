import { Elysia } from "elysia";
import ical, { VEvent } from "node-ical";

import { EventDTO } from "@models/eventsModel";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import { CalendarDTO } from "../models/calendarModel";
import { addOrUpdateEvent, filterUpcomingEvents } from "../utils/calendarUtils";

export const syncCalendarRouter = new Elysia()
  .use(jwtConfig)
  .derive(authorizationMiddleware)
  .guard(
    {
      beforeHandle: ({ user, error }) => {
        if (!user) return error(401, "Not Authorized");
      },
    },
    (app) =>
      app.post("/calendar/sync-all", async ({ user, error }) => {
        try {
          const calendars = await CalendarDTO.findAllWithExternalSource(
            user.id
          );
          if (calendars.length === 0) {
            return { message: "No calendars to sync." };
          }

          let totalUpdated = 0;
          let totalAdded = 0;
          let totalDeleted = 0;

          for (const calendar of calendars) {
            if (!calendar.external_source_url) continue;
            const parsed = await ical.async.fromURL(
              calendar.external_source_url
            );
            const events = Object.values(parsed).filter(
              (e): e is VEvent => (e as any).type === "VEVENT"
            );
            const upcomingEvents = filterUpcomingEvents(events, 90);
            const existingEvents = await EventDTO.getEvents(calendar.id);
            const newEventUids = new Set(events.map((e) => e.uid));
            for (const existingEvent of existingEvents) {
              if (!newEventUids.has(existingEvent.ics_uid)) {
                await EventDTO.deleteEvent(existingEvent.id);
                totalDeleted++;
              }
            }

            for (const e of upcomingEvents) {
              const { updated, added } = await addOrUpdateEvent(
                e,
                calendar.id,
                user.id
              );
              if (updated) totalUpdated++;
              if (added) totalAdded++;
            }

            await CalendarDTO.updateLastSync(calendar.id, new Date());
          }

          return {
            message: "Calendars synchronized successfully",
            totalUpdated,
            totalAdded,
            totalDeleted,
          };
        } catch (err) {
          console.error(err);
          return error(500, "Failed to synchronize calendars");
        }
      })
  );
