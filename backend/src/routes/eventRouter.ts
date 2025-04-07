import Elysia from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import { eventModelBody } from "src/models/eventsModel";
import { EventDTO } from "src/models/eventsModel";
import { AttendanceDTO } from "src/models/attendanceModel";

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

          const event = await createEvent({
            ...eventData,
            proposed_by_user_id: user.id,
          });

          if (!event) return error(500, "Event not created");

          try {
            const newEntry = await addEventToCalendar({
              events_id: event.id,
              calendars_id: calendar_id,
            });

            if (!newEntry)
              return error(500, "Error creating entry in events_calendars");
          } catch {
            console.error("Error creating entry in events_calendars:", error);
            return error(500, "Error creating entry in events_calendars");
          }

          try {
            const newAttendance = await recordAttendance({
              event_id: event.id,
              user_id: user.id,
              status: "accepted",
            });

            if (!newAttendance)
              return error(500, "Error creating entry in event_attendance");
          } catch {
            console.error("Error creating entry in event_attendance:", error);
            return error(500, "Error creating entry in event_attendance");
          }

          return { event };
        },
        {
          body: eventModelBody,
        }
      )
  );
