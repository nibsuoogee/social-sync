import { EventsCalendars } from "@shared/index";
import { sql } from "bun";

/**
 * Events-Calendars Many-to-Many Relationship Data Transfer Object
 */
export const EventsCalendarsDTO = {
  linkEventToCalendar: async (
    relation: EventsCalendars
  ): Promise<EventsCalendars> => {
    const [newRelation] = await sql`
      INSERT INTO events_calendars ${sql(relation)}
      RETURNING *
    `;
    return newRelation;
  },
};
