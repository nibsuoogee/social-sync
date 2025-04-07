import Elysia, { t } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import {
  CalendarDTO,
  CalendarModelForCreation,
  CalendarModelForUpdate,
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
              name: body.name,
              description: body.description,
              owner_user_id: user.id,
              is_group: body.is_group,
              color: body.color,
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
            // 1) get the user's calendars
            const [calendars, err] = await tryCatch(
              CalendarDTO.getCalendars(user.id)
            );
            if (err) return error(500, err.message);
            if (!calendars) return error(500, "Failed to get calendars");

            console.log("calendars:");
            console.log(calendars);

            return calendars;
          },
          {
            response: {
              200: t.Array(calendarModel),
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
            const calendarForUpdate: CalendarModelForUpdate = {
              name: body.name,
              description: body.description,
              color: body.color,
            };
            const [calendar, errCalendar] = await tryCatch(
              CalendarDTO.updateCalendar(body.id, calendarForUpdate)
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
