import Elysia, { t } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import {
  Calendar,
  CalendarDTO,
  CalendarModelForCreation,
  calendarCreateBody,
  calendarModel,
  calendarUpdateBody,
} from "../models/calendarModel";
import {
  MembershipDTO,
  membershipModel,
  MembershipModelForCreation,
} from "src/models/membershipModel";
import { getRandomColor } from "@shared/src/util/random";
import { tryCatch } from "@shared/src/tryCatch";
import { Event, EventDTO, eventModel } from "src/models/eventsModel";

export const calendarRouter = new Elysia()
  .use(jwtConfig)
  .derive(authorizationMiddleware)
  .guard(
    {
      beforeHandle: ({ user, error }) => {
        // 1. Check if the user is authenticated
        //    If not, return a 401 error
        if (!user) return error(401, "Not Authorized");
      },
    },
    (app) =>
      app
        .post(
          "/calendar",
          async ({ body, user, error }) => {
            // 1) create a new calendar for the user
            const calendarForCreation: CalendarModelForCreation = {
              owner_user_id: user.id,
              ...body,
            };
            const [calendar, errCalendar] = await tryCatch(
              CalendarDTO.createCalendar(calendarForCreation)
            );
            if (errCalendar) return error(500, errCalendar.message);
            if (!calendar) return error(500, "Failed to create calendar");

            // 2) use membershipModel to create a new membership
            const membershipForCreation: MembershipModelForCreation = {
              calendar_id: calendar.id,
              user_id: user.id,
              role: "owner",
              color: getRandomColor(),
            };
            const [membership, errMembership] = await tryCatch(
              MembershipDTO.createMembership(membershipForCreation)
            );
            if (errMembership) return error(500, errMembership.message);
            if (!membership) return error(500, "Failed to create membership");

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
        .get(
          "/calendars",
          async ({ user, error }) => {
            // 1) get the calendars which the user has a membership for
            const [calendars, err] = await tryCatch(
              CalendarDTO.getCalendars(user.id)
            );
            if (err) return error(500, err.message);
            if (!calendars) return error(500, "Failed to get calendars");

            return calendars;
          },
          {
            response: {
              200: t.Array(calendarModel),
              500: t.String(),
            },
          }
        )
        .get(
          "/calendar/:id",
          async ({ params, user, error }) => {
            // 1) check if the user has a membership in the calendar
            const [hasMembership, errMembership] = await tryCatch(
              MembershipDTO.hasMembership(params.id, user.id)
            );
            if (errMembership) return error(500, errMembership.message);
            if (!hasMembership)
              return error(401, "No authorized access to calendar");

            // 2) get the calendar
            const [calendar, errCalendar] = await tryCatch(
              CalendarDTO.getCalendar(params.id)
            );
            if (errCalendar) return error(500, errCalendar.message);
            if (!calendar) return error(500, "Failed to get calendar");

            // 3) get all events in the calendar
            const [events, errEvents] = await tryCatch(
              EventDTO.getEvents(params.id)
            );
            if (errEvents) return error(500, errEvents.message);
            if (!events) return error(500, "Failed to get events");

            return { calendar, events };
          },
          {
            params: t.Object({ id: t.Integer() }),
            response: {
              200: t.Object({
                calendar: calendarModel,
                events: t.Array(eventModel),
              }),
              401: t.String(),
              500: t.String(),
            },
          }
        )
        .get(
          "/calendar/all",
          async ({ user, error }) => {
            // 1) get the user's calendars
            const [calendars, errCalendars] = await tryCatch(
              CalendarDTO.getPersonalCalendars(user.id)
            );
            if (errCalendars) return error(500, errCalendars.message);
            if (!calendars) return error(500, "Failed to get calendars");

            // 2) get events for all calendars
            const eventPromises = calendars.map(async (calendar) => {
              const [events, errEvents] = await tryCatch(
                EventDTO.getEvents(calendar.id)
              );
              return { calendar, events, errEvents };
            });
            const eventResults = await Promise.all(eventPromises);

            // 3) Check for errors
            for (const result of eventResults) {
              const { events, errEvents } = result;
              if (errEvents) return error(500, errEvents.message);
              if (!events) return error(500, "Failed to get events");
            }

            // 4) construct the result array
            const results = eventResults.map(({ calendar, events }) => ({
              calendar,
              events,
            })) as {
              calendar: Calendar;
              events: Event[];
            }[];

            return results;
          },
          {
            response: {
              200: t.Array(
                t.Object({
                  calendar: calendarModel,
                  events: t.Array(eventModel),
                })
              ),
              401: t.String(),
              500: t.String(),
            },
          }
        )
        .patch(
          "/calendar",
          async ({ body, user, error }) => {
            // 1) check if the user owns the calendar
            const [isCalendarOwner, errOwner] = await tryCatch(
              CalendarDTO.isCalendarOwner(body.id, user.id)
            );
            if (errOwner) return error(500, errOwner.message);
            if (!isCalendarOwner)
              return error(401, "No authorized access to calendar");

            // 2) Update the calendar
            const { id, ...calendarForUpdate } = body;

            const [calendar, errCalendar] = await tryCatch(
              CalendarDTO.updateCalendar(id, calendarForUpdate)
            );
            if (errCalendar) return error(500, errCalendar.message);
            if (!calendar) return error(500, "Failed to update calendar");

            return calendar;
          },
          {
            body: calendarUpdateBody,
            response: {
              200: calendarModel,
              401: t.String(),
              500: t.String(),
            },
          }
        )
        .delete(
          "/calendar/:id",
          async ({ params, user, error }) => {
            // 1) check if the user owns the calendar
            const [isCalendarOwner, errOwner] = await tryCatch(
              CalendarDTO.isCalendarOwner(params.id, user.id)
            );
            if (errOwner) return error(500, errOwner.message);
            if (!isCalendarOwner)
              return error(401, "No authorized access to calendar");

            // 2) delete the calendar
            const [deleteCalendar, errDelete] = await tryCatch(
              CalendarDTO.deleteCalendar(params.id)
            );
            if (errDelete) return error(500, errDelete.message);
            if (!deleteCalendar) return error(404, "Calendar not found.");

            return "Calendar deleted.";
          },
          {
            params: t.Object({ id: t.Integer() }),
            response: {
              200: t.String(),
              401: t.String(),
              404: t.String(),
              500: t.String(),
            },
          }
        )
  );
