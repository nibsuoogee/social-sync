import { Elysia } from "elysia";
import ical, { VEvent } from "node-ical";

import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import { filterUpcomingEvents, addOrUpdateEvent } from "../utils/calendarUtils";

import { CalendarDTO } from "../models/calendarModel";
import { MembershipDTO } from "../models/membershipModel";
import { tryCatch } from "@shared/src/tryCatch";
import { getRandomColor } from "@shared/src/util/random";

async function createNewUserCalendar(userId: number, sourceUrl: string, name: string) {
  const now = new Date();

  const [calendar, errCalendar] = await tryCatch(
    CalendarDTO.createCalendar({
      name: name,
      description: "Imported Calendar from URL",
      owner_user_id: userId,
      is_group: false,
      color: getRandomColor(),
      external_source_url: sourceUrl,
      external_last_sync: now,
      external_sync_status: "active",
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
        const { url, name } = body as { url?: string; name?: string };

        if (!url || typeof url !== "string") {
          return error(400, "Missing or invalid URL");
        }
        if (!name || typeof name !== "string") {
          return error(400, "Missing or invalid calendar name");
        }

        try {
          const existingCalendar = await CalendarDTO.findByOwnerAndUrl(
            user.id,
            url
          );
          if (existingCalendar) {
            return error(400, { message: "You have already imported this calendar." });
          }

          const parsed = await ical.async.fromURL(url);
          const events = Object.values(parsed).filter(
            (e): e is VEvent => (e as any).type === "VEVENT"
          );
          const upcomingEvents = filterUpcomingEvents(events, 90);
          const calendarId = await createNewUserCalendar(user.id, url, name);

          let importedCount = 0;
          for (const e of upcomingEvents) {
            const { added } = await addOrUpdateEvent(e, calendarId, user.id);
            if (added) importedCount++;
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