import { t, Elysia } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import {
  eventModel,
  eventModelBody,
  eventsCalendarsModel,
} from "src/models/eventsModel";
import { EventDTO } from "src/models/eventsModel";
import { AttendanceDTO, attendanceModel } from "src/models/attendanceModel";
import { tryCatch } from "@shared/src/tryCatch";

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
      app.post(
        "/new-event",
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
  );
