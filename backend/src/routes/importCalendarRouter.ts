import { Elysia, t } from "elysia";
import ical, { VEvent } from "node-ical";

import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import { filterUpcomingEvents, addOrUpdateEvent } from "../utils/calendarUtils";

import {
  calendarCreateBody,
  CalendarDTO,
  calendarModel,
  CalendarModelForCreation,
} from "../models/calendarModel";
import { MembershipDTO, membershipModel } from "../models/membershipModel";
import { tryCatch } from "@shared/src/tryCatch";
import { getRandomColor } from "@shared/src/util/random";

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
      app.post(
        "/import",
        async ({ body, user, error }) => {
          // 1) creating calendar model for creation
          const calendarForCreation: CalendarModelForCreation = {
            owner_user_id: user.id,
            external_sync_status: "active",
            external_last_sync: new Date(),
            ...body,
          };

          // if url was not defined
          if (!body.external_source_url) {
            return error(500, "Missing external source URL");
          }

          // 2) checking if imported calendar already exists
          const [existingCalendar, errExistingCalendar] = await tryCatch(
            CalendarDTO.findByOwnerAndUrl(user.id, body.external_source_url)
          );
          if (errExistingCalendar)
            return error(500, errExistingCalendar.message);
          if (existingCalendar)
            return error(500, "You have already imported this calendar");

          const parsed = await ical.async.fromURL(body.external_source_url);

          const events = Object.values(parsed).filter(
            (e): e is VEvent => (e as any).type === "VEVENT"
          );
          const upcomingEvents = filterUpcomingEvents(events, 90);

          // 3) create calendar
          const [calendar, errCalendar] = await tryCatch(
            CalendarDTO.createCalendar(calendarForCreation)
          );
          if (errCalendar) throw new Error(errCalendar.message);
          if (!calendar) throw new Error("Failed to create calendar");

          // 4) create new membership for calendar
          const [membership, errMembership] = await tryCatch(
            MembershipDTO.createMembership({
              calendar_id: calendar.id,
              user_id: user.id,
              role: "owner",
              color: getRandomColor(),
            })
          );
          if (errMembership) throw new Error(errMembership.message);
          if (!membership) throw new Error("Failed to create membership");

          let importedCount = 0;
          for (const e of upcomingEvents) {
            const { added } = await addOrUpdateEvent(e, calendar.id, user.id);
            if (added) importedCount++;
          }

          return { calendar, membership };
        },
        {
          body: calendarCreateBody,
          response: {
            200: t.Object({
              calendar: calendarModel,
              membership: membershipModel,
            }),
            500: t.String(),
          },
        }
      )
  );
