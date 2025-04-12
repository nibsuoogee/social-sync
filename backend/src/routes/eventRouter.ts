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
import {
  AttendanceDTO,
  attendanceModel,
  AttendanceModelForCreation,
} from "src/models/attendanceModel";
import { tryCatch } from "@shared/src/tryCatch";
import { MembershipDTO } from "src/models/membershipModel";

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
            // 1) Create the event
            const { calendar_id, ...eventData } = body;

            const [event, errEvent] = await tryCatch(
              EventDTO.createEvent({
                ...eventData,
                proposed_by_user_id: user.id,
                user_read_only: false,
              })
            );
            if (errEvent) return error(500, errEvent.message);
            if (!event) return error(500, "Event not created");

            // 2) Add the event to the calendar
            const [eventsCalendar, errEventsCalendar] = await tryCatch(
              EventDTO.addEventToCalendar({
                events_id: event.id,
                calendars_id: calendar_id,
              })
            );
            if (errEventsCalendar) return error(500, errEventsCalendar.message);
            if (!eventsCalendar)
              return error(500, "Error creating entry in events_calendars");

            // 3) Get the user's membership id
            const [membershipId, errMembership] = await tryCatch(
              MembershipDTO.getIdByUserAndCalendar(calendar_id, user.id)
            );
            if (errMembership) return error(500, errMembership.message);
            if (!membershipId) return error(500, "Error getting membership id");

            // 4) Add the attendance row
            const attendance: AttendanceModelForCreation = {
              event_id: event.id,
              membership_id: membershipId,
              status: "accepted",
            };
            const [newAttendance, errNewAttendance] = await tryCatch(
              AttendanceDTO.recordAttendance(attendance)
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
        .patch(
          "/event",
          async ({ body, user, error }) => {
            // 1) check if the user can modify the event
            const [isEventOwner, errOwner] = await tryCatch(
              EventDTO.canModify(body.id, user.id)
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
              EventDTO.canModify(params.id, user.id)
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
