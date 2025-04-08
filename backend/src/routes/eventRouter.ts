import { t, Elysia } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import {
  eventModel,
  eventModelBody,
  EventModelForUpdate,
  eventsCalendarsModel,
  eventUpdateBody,
} from "src/models/eventsModel";
import { EventDTO } from "src/models/eventsModel";
import { AttendanceDTO, attendanceModel } from "src/models/attendanceModel";
import { tryCatch } from "@shared/src/tryCatch";
import { MembershipDTO } from "src/models/membershipModel";
import { EventsCalendarsDTO } from "src/models/eventsCalendarsModel";

export const eventRouter = new Elysia()
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
          "/event",
          async ({ body, user, error }) => {
            const { createEvent, addEventToCalendar } = EventDTO;
            const { recordAttendance } = AttendanceDTO;

            const { calendar_id, ...eventData } = body;

            const [event, errEvent] = await tryCatch(
              createEvent({
                ...eventData,
                proposed_by_user_id: user.id,
              })
            );
            if (errEvent) return error(500, errEvent.message);
            if (!event) return error(500, "Event not created");

            const [eventsCalendar, errEventsCalendar] = await tryCatch(
              addEventToCalendar({
                events_id: event.id,
                calendars_id: calendar_id,
              })
            );
            if (errEventsCalendar) return error(500, errEventsCalendar.message);
            if (!eventsCalendar)
              return error(500, "Error creating entry in events_calendars");

            const [newAttendance, errNewAttendance] = await tryCatch(
              recordAttendance({
                event_id: event.id,
                user_id: user.id,
                status: "accepted",
              })
            );
            if (errNewAttendance) return error(500, errNewAttendance.message);
            if (!newAttendance)
              return error(500, "Error creating entry in event_attendance");

            return { event, eventsCalendar, newAttendance };
          },
          {
            body: eventModelBody,
            response: {
              200: t.Object({
                event: eventModel,
                eventsCalendar: eventsCalendarsModel,
                newAttendance: attendanceModel,
              }),
              500: t.String(),
            },
          }
        )
        .get(
          "/events/:calendar_id",
          async ({ params, user, error }) => {
            // 1) check if the user has a membership in the calendar
            const [hasMembership, errMembership] = await tryCatch(
              MembershipDTO.hasMembership(params.calendar_id, user.id)
            );
            if (errMembership) return error(500, errMembership.message);
            if (!hasMembership)
              return error(401, "No authorized access to calendar");

            // 2) get all events in the calendar
            const [events, err] = await tryCatch(
              EventDTO.getEvents(params.calendar_id)
            );
            if (err) return error(500, err.message);
            if (!events) return error(500, "Failed to get events");

            return events;
          },
          {
            params: t.Object({ calendar_id: t.Integer() }),
            response: {
              200: t.Array(eventModel),
              401: t.String(),
              500: t.String(),
            },
          }
        )
        .patch(
          "/event",
          async ({ body, user, error }) => {
            // 1) check if the user owns the event
            const [isEventOwner, errOwner] = await tryCatch(
              EventDTO.isEventOwner(body.id, user.id)
            );
            if (errOwner) return error(500, errOwner.message);
            if (!isEventOwner)
              return error(401, "No authorized access to event");

            // 2) Update the event
            const { id, ...eventForUpdate } = body;

            const [event, errEvent] = await tryCatch(
              EventDTO.updateEvent(id, eventForUpdate)
            );
            if (errEvent) return error(500, errEvent.message);
            if (!event) return error(500, "Failed to update event");

            return event;
          },
          {
            body: eventUpdateBody,
            response: {
              200: eventModel,
              401: t.String(),
              500: t.String(),
            },
          }
        )
        .delete(
          "/event/:id",
          async ({ params, user, error }) => {
            // 1) check if the user owns the event
            const [isEventOwner, errOwner] = await tryCatch(
              EventDTO.isEventOwner(params.id, user.id)
            );
            if (errOwner) return error(500, errOwner.message);
            if (!isEventOwner)
              return error(401, "No authorized access to event");

            // 2) delete the event
            const [deletedEvent, errDelete] = await tryCatch(
              EventDTO.deleteEvent(params.id)
            );
            if (errDelete) return error(500, errDelete.message);
            if (!deletedEvent) return error(404, "Event not found.");

            return "Event deleted.";
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
