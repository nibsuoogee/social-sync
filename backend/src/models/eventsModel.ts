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
  addEventToCalendar: async (
    eventsCalendars: EventsCalendarsModel
  ): Promise<EventsCalendarsModel> => {
    const [newEntry] = await sql`
      INSERT INTO events_calendars ${sql(eventsCalendars)}
      RETURNING *
    `;

    return newEntry;
  },
};

export const eventModelForCreation = t.Object({
  ics_uid: t.String(),
  title: t.String(),
  description: t.Optional(t.String()),
  location: t.Optional(t.String()),
  start_time: t.String(), // ISO timestamp string
  end_time: t.String(), // ISO timestamp string
  timezone: t.Optional(t.String()),
  all_day: t.Optional(t.Boolean()),
  recurrence_rule: t.Optional(t.String()),
  status: t.Optional(
    t.Enum({
      confirmed: "confirmed",
      tentative: "tentative",
      cancelled: "cancelled",
    })
  ),
  proposed_by_user_id: t.Integer(),
});
export type EventModelForCreation = typeof eventModelForCreation.static;

export const eventModel = t.Object({
  id: t.Integer(),
  ics_uid: t.String(),
  title: t.String(),
  description: t.Optional(t.String()),
  location: t.Optional(t.String()),
  start_time: t.Date(),
  end_time: t.Date(),
  timezone: t.String(),
  all_day: t.Boolean(),
  recurrence_rule: t.Optional(t.String()),
  status: t.Enum({
    confirmed: "confirmed",
    tentative: "tentative",
    cancelled: "cancelled",
  }),
  created_at: t.Date(), // ISO timestamp
  updated_at: t.Date(), // ISO timestamp
  proposed_by_user_id: t.Integer(),
});
export type Event = typeof eventModel.static;

export const eventModelBody = t.Object({
  calendar_id: t.Integer(),
  ics_uid: t.String(),
  title: t.String(),
  description: t.Optional(t.String()),
  location: t.Optional(t.String()),
  start_time: t.String(), // ISO timestamp string
  end_time: t.String(), // ISO timestamp string
  timezone: t.Optional(t.String()),
  all_day: t.Optional(t.Boolean()),
  recurrence_rule: t.String(),
});
export type EventModelBody = typeof eventModelBody.static;

export const eventsCalendarsModel = t.Object({
  calendars_id: t.Integer(),
  events_id: t.Integer(),
});
export type EventsCalendarsModel = typeof eventsCalendarsModel.static;
