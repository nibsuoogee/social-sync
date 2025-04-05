import { t } from "elysia";
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

export const eventsCalendarsModel = t.Object({
  events_id: t.Integer(),
  calendars_id: t.Integer(),
});
export type EventsCalendars = typeof eventsCalendarsModel.static;
