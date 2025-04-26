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
  getEvents: async (calendar_id: number): Promise<Event[]> => {
    const events = await sql`
      SELECT *
      FROM events
      WHERE calendar_id = ${calendar_id}
    `;
    return [...events];
  },
  updateEvent: async (
    event_id: number,
    event: EventModelForUpdate
  ): Promise<Event> => {
    const [newEvent] = await sql`
      UPDATE events SET ${sql(event)}
      WHERE id = ${event_id}
      RETURNING *
    `;
    return newEvent;
  },
  deleteEvent: async (event_id: number): Promise<Event> => {
    const [deletedEvent] = await sql`
      DELETE FROM events 
      WHERE id = ${event_id}
      RETURNING *;`;
    return deletedEvent;
  },
  canModify: async (
    event_id: number,
    proposed_by_user_id: number
  ): Promise<boolean> => {
    const [result] = await sql`
      SELECT EXISTS(SELECT 1 FROM events 
      WHERE id = ${event_id} 
      AND proposed_by_user_id = ${proposed_by_user_id}
      AND user_read_only = false)`;
    return result;
  },
  findByUidAndCalendar: async (
    uid: string,
    calendarId: number
  ): Promise<Event | null> => {
    const [event] = await sql`
      SELECT id, title, description, location, start_time, end_time, timezone, all_day, recurrence_rule 
      FROM events
      WHERE ics_uid = ${uid} AND calendar_id = ${calendarId} 
      LIMIT 1
    `;
    return event || null;
  },
};

export const eventModelForCreation = t.Object({
  ics_uid: t.String(),
  calendar_id: t.Integer(),
  title: t.String(),
  description: t.String(),
  location: t.String(),
  start_time: t.Date(),
  end_time: t.Date(),
  timezone: t.Optional(t.String()),
  all_day: t.Optional(t.Boolean()),
  recurrence_rule: t.String(),
  status: t.Optional(
    t.Enum({
      confirmed: "confirmed",
      tentative: "tentative",
      cancelled: "cancelled",
    })
  ),
  proposed_by_user_id: t.Integer(),
  user_read_only: t.Boolean(),
});
export type EventModelForCreation = typeof eventModelForCreation.static;

export const eventModel = t.Object({
  id: t.Integer(),
  ics_uid: t.String(),
  title: t.String(),
  description: t.String(),
  location: t.String(),
  start_time: t.Date(),
  end_time: t.Date(),
  timezone: t.String(),
  all_day: t.Boolean(),
  recurrence_rule: t.String(),
  status: t.Enum({
    confirmed: "confirmed",
    tentative: "tentative",
    cancelled: "cancelled",
  }),
  created_at: t.Date(), // ISO timestamp
  updated_at: t.Date(), // ISO timestamp
  proposed_by_user_id: t.Integer(),
  user_read_only: t.Boolean(),
});
export type Event = typeof eventModel.static;

export const eventModelBody = t.Object({
  calendar_id: t.Integer(),
  ics_uid: t.Optional(t.String()),
  title: t.String(),
  description: t.String(),
  location: t.String(),
  start_time: t.Date(),
  end_time: t.Date(),
  timezone: t.Optional(t.String()),
  all_day: t.Optional(t.Boolean()),
  recurrence_rule: t.String(),
});
export type EventModelBody = typeof eventModelBody.static;

export const eventUpdateBody = t.Object({
  id: t.Integer(),
  title: t.Optional(t.String()),
  description: t.Optional(t.String()),
  location: t.Optional(t.String()),
  start_time: t.Optional(t.Date()),
  end_time: t.Optional(t.Date()),
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
});
export type EventUpdateBody = typeof eventUpdateBody.static;

export const eventModelForUpdate = t.Omit(eventUpdateBody, ["id"]);
export type EventModelForUpdate = typeof eventModelForUpdate.static;
