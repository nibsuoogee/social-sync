import { Event, EventDTO } from "@models/eventsModel";
import {
  MembershipDTO,
  membershipModel,
  MembershipModelForCreation,
} from "@models/membershipModel";
import { deepCopy } from "@utils/objects";
import { getRandomColor } from "@utils/random";
import { tryCatch } from "@utils/tryCatch";
import Elysia, { t } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import { httpRequestDuration } from "../metrics";
import {
  Calendar,
  CalendarAndEvents,
  calendarCreateBody,
  CalendarDTO,
  calendarModel,
  CalendarModelForCreation,
  calendarUpdateBody,
  calendarViewRequest,
  defaultCalendar,
} from "../models/calendarModel";

/**
 * Get all the calendars for a specific user
 */
async function getAllCalendarsHandler(
  targetUserId: number,
  excludeCalendarId?: number
): Promise<
  {
    calendar: Calendar;
    events: Event[];
  }[]
> {
  // 1) get the user's calendars
  const [calendars, errCalendars] = await tryCatch(
    typeof excludeCalendarId !== "undefined"
      ? CalendarDTO.getCalendarsExcludeOne(targetUserId, excludeCalendarId)
      : CalendarDTO.getCalendars(targetUserId)
  );
  if (errCalendars) throw new Error(errCalendars.message);
  if (!calendars) throw new Error("Failed to get calendars");

  // 2) get events for all calendars
  const eventPromises = calendars.map(async (calendar) => {
    const [events, errEvents] = await tryCatch(EventDTO.getEvents(calendar.id));
    return { calendar, events, errEvents };
  });
  const eventResults = await Promise.all(eventPromises);

  // 3) Check for errors
  for (const result of eventResults) {
    const { events, errEvents } = result;
    if (errEvents) throw new Error(errEvents.message);
    if (!events) throw new Error("Failed to get events");
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
}

async function getCalendarById(calendar_id: number) {
  // 1) get the calendar
  const [calendar, errCalendar] = await tryCatch(
    CalendarDTO.getCalendar(calendar_id)
  );
  if (errCalendar) throw new Error(errCalendar.message);
  if (!calendar) throw new Error("Failed to get calendar");

  // 2) get all events in the calendar
  const [events, errEvents] = await tryCatch(EventDTO.getEvents(calendar_id));
  if (errEvents) throw new Error(errEvents.message);
  if (!events) throw new Error("Failed to get events");

  return { calendar, events };
}

function calendarsToSingleCalendar(
  calendars: CalendarAndEvents[],
  membershipColor: string
): CalendarAndEvents {
  const temporaryCalendar = deepCopy(defaultCalendar);

  if (calendars.length === 0)
    return { calendar: temporaryCalendar, events: [] };

  const allMemberEvents = calendars.flatMap(
    (calendarsAndEvents) => calendarsAndEvents.events
  );

  temporaryCalendar.color = membershipColor;

  return {
    calendar: temporaryCalendar,
    events: allMemberEvents,
  };
}

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
            const startTime = Date.now();
            // 1) get the calendars which the user has a membership for
            const [calendars, err] = await tryCatch(
              CalendarDTO.getCalendars(user.id)
            );
            if (err) return error(500, err.message);
            if (!calendars) return error(500, "Failed to get calendars");

            const duration = Date.now() - startTime;
            // Log the duration of the request
            httpRequestDuration
                .labels({
                    method: "GET",
                    route: "/calendars",
                    code: "200"
                })
                .observe(duration);

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

            // 2) get the calendar and events
            const [calendar, err] = await tryCatch(getCalendarById(params.id));
            if (err) return error(500, err.message);
            if (!calendar) return error(500, "Failed to get calendar");

            return {
              mainCalendar: [calendar],
              personalCalendars: [],
              groupMemberCalendars: [],
            };
          },
          {
            params: t.Object({ id: t.Integer() }),
            response: {
              200: calendarViewRequest,
              401: t.String(),
              500: t.String(),
            },
          }
        )
        .get(
          "/calendar/all",
          async ({ user, error }) => {
            const [calendars, err] = await tryCatch(
              getAllCalendarsHandler(user.id)
            );
            if (err) return error(500, err.message);
            if (!calendars) return error(500, "Failed to get calendars");

            return {
              mainCalendar: [],
              personalCalendars: calendars,
              groupMemberCalendars: [],
            };
          },
          {
            response: {
              200: calendarViewRequest,
              401: t.String(),
              500: t.String(),
            },
          }
        )
        /**
         * Get the events of all group members. Each one of a member's
         * personal calendar events should be combined into a single calendar
         * whose color is the same as the member's membership color. The group
         * calendar in question should not be included in each member's
         * calendars to avoid duplicating it.
         */
        .get(
          "/calendar/group/:id",
          async ({ params, user, error }) => {
            // 1) check if the user has a membership in the calendar
            const [hasMembership, errMembership] = await tryCatch(
              MembershipDTO.hasMembership(params.id, user.id)
            );
            if (errMembership) return error(500, errMembership.message);
            if (!hasMembership)
              return error(401, "No authorized access to calendar");

            // 2) get the other users with memberships
            const [members, errMembers] = await tryCatch(
              MembershipDTO.getMemberships(params.id)
            );
            if (errMembers) return error(500, errMembers.message);
            if (!members) return error(500, "Failed to get members");

            const otherMembers = members.filter((m) => m.user_id !== user.id);

            // 3) get the user's calendars
            const [userCalendars, errUserCalendars] = await tryCatch(
              getAllCalendarsHandler(user.id, params.id)
            );
            if (errUserCalendars) return error(500, errUserCalendars.message);
            if (!userCalendars)
              return error(500, "Failed to get user calendars");

            const userMembershipColor = members.filter(
              (m) => m.user_id === user.id
            )[0].color;

            // 4) get the calendars of the other members and combine them
            //    into single calendars
            const memberCalendarsWithError = await Promise.all(
              otherMembers.map(async (member) => {
                const [calendarsAndEvents, err] = await tryCatch(
                  getAllCalendarsHandler(member.user_id, params.id)
                );
                if (err) return { errorMessage: err.message };
                if (!calendarsAndEvents)
                  return { errorMessage: "Failed to get calendars and events" };

                return calendarsToSingleCalendar(
                  calendarsAndEvents,
                  member.color
                );
              })
            );

            // 5) check for errors
            for (const result of memberCalendarsWithError) {
              if ("errorMessage" in result) {
                return error(500, result.errorMessage);
              }
            }
            const memberCalendars = memberCalendarsWithError.filter(
              (cal): cal is CalendarAndEvents => !("errorMessage" in cal)
            );

            // 6) concat personal calendars into single personal calendar
            const personalCalendar = calendarsToSingleCalendar(
              userCalendars,
              userMembershipColor
            );

            // 7) get the group calendar
            const [mainCalendar, err] = await tryCatch(
              getCalendarById(params.id)
            );
            if (err) return error(500, err.message);
            if (!mainCalendar)
              return error(500, "Failed to get group calendar");

            // 8) return the calendars
            return {
              mainCalendar: [mainCalendar],
              personalCalendars: [personalCalendar],
              groupMemberCalendars: memberCalendars,
            };
          },
          {
            params: t.Object({ id: t.Integer() }),
            response: {
              200: calendarViewRequest,
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
