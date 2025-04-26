import { tryCatch } from "@shared/src/tryCatch";
import { randomUUIDv7 } from "bun";
import { Elysia, t } from "elysia";
import {
  EventDTO,
  eventModel,
  eventModelBody,
  eventUpdateBody,
} from "src/models/eventsModel";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";

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
                calendar_id: calendar_id,
                ics_uid: eventData.ics_uid ?? randomUUIDv7(),
                proposed_by_user_id: user.id,
                user_read_only: false,
              })
            );
            if (errEvent) return error(500, errEvent.message);
            if (!event) return error(500, "Event not created");

            return { event };
          },
          {
            body: eventModelBody,
            response: {
              200: t.Object({
                event: eventModel,
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

            return "Event deleted";
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
