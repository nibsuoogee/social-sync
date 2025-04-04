import { Event, EventModelForCreation } from "@shared/index";
import { sql } from "bun";
import { t } from "elysia";

/**
 * Event Data Transfer Object
 */
export const EventDTO = {
  createEvent: async (event: EventModelForCreation): Promise<Event> => {
    const [newEvent] = await sql`
      INSERT INTO events ${sql(event)}
      RETURNING *
    `;
    return newEvent;
  },
};
