import { t } from "elysia";
import { sql } from "bun";

/**
 * Calendar Data Transfer Object
 */
export const CalendarDTO = {
  createCalendar: async (
    calendar: CalendarModelForCreation
  ): Promise<Calendar> => {
    const [newCalendar] = await sql`
      INSERT INTO calendars ${sql(calendar)}
      RETURNING *
    `;
    return newCalendar;
  },
  getCalendars: async (user_id: number): Promise<Calendar[]> => {
    const calendars = await sql`
      SELECT calendars.*
      FROM calendars
      JOIN memberships ON calendars.id = memberships.calendar_id
      WHERE memberships.user_id = ${user_id}`;
    return [...calendars];
  },
  updateCalendar: async (
    calendar_id: number,
    calendar: CalendarModelForUpdate
  ): Promise<Calendar> => {
    const [newCalendar] = await sql`
      UPDATE calendars SET ${sql(calendar)}
      WHERE id = ${calendar_id}
      RETURNING *
    `;
    return newCalendar;
  },
  deleteCalendar: async (calendar_id: number): Promise<Calendar> => {
    const [deletedCalendar] = await sql`
      DELETE FROM calendars 
      WHERE id = ${calendar_id}
      RETURNING *;
    `;
    return deletedCalendar;
  },
  isCalendarOwner: async (
    calendar_id: number,
    owner_user_id: number
  ): Promise<boolean> => {
    const [result] = await sql`
      SELECT EXISTS(SELECT 1 FROM calendars 
      WHERE id = ${calendar_id} AND owner_user_id = ${owner_user_id})`;
    return result;
  },
  findByOwnerAndUrl: async (
    ownerUserId: number,
    externalSourceUrl: string
  ): Promise<Calendar | null> => {
    const [calendar] = await sql`
      SELECT * FROM calendars
      WHERE owner_user_id = ${ownerUserId} AND external_source_url = ${externalSourceUrl}
      LIMIT 1
    `;
    return calendar || null;
  },
  findAllWithExternalSource: async (ownerUserId: number): Promise<Calendar[]> => {
    const calendars = await sql`
      SELECT * FROM calendars
      WHERE owner_user_id = ${ownerUserId} AND external_source_url IS NOT NULL
    `;
    return calendars;
  },
  findByCalendarId: async (calendarId: number): Promise<Event[]> => {
    const events = await sql`
      SELECT e.id, e.ics_uid FROM events e
      JOIN events_calendars ec ON ec.events_id = e.id
      WHERE ec.calendars_id = ${calendarId}
    `;
    return events;
  },
  updateLastSync: async (calendarId: number, date: Date): Promise<void> => {
    await sql`
      UPDATE calendars
      SET external_last_sync = ${date}
      WHERE id = ${calendarId}
    `;
  },
};

export const calendarModel = t.Object({
  id: t.Integer(),
  name: t.String(),
  description: t.String(),
  owner_user_id: t.Integer(), // get this from the jwt token
  is_group: t.Boolean(),
  created_at: t.Date(),
  color: t.String(),
  external_source_name: t.Optional(t.Union([t.String(), t.Null()])),
  external_source_url: t.Optional(t.Union([t.String(), t.Null()])),
  external_last_sync: t.Optional(t.Union([t.Date(), t.Null()])),
  external_sync_status: t.Optional(
    t.Union([
      t.Enum({
        inactive: "inactive",
        active: "active",
        failed: "failed",
      }),
      t.Null(),
    ])
  ),
});
export type Calendar = typeof calendarModel.static;

export const calendarModelForCreation = t.Object({
  name: t.String(),
  description: t.String(),
  owner_user_id: t.Integer(),
  is_group: t.Boolean(),
  color: t.String(),
  external_source_name: t.Optional(t.Union([t.String(), t.Null()])),
  external_source_url: t.Optional(t.Union([t.String(), t.Null()])),
  external_last_sync: t.Optional(t.Union([t.Date(), t.Null()])),
  external_sync_status: t.Optional(
    t.Union([
      t.Enum({
        inactive: "inactive",
        active: "active",
        failed: "failed",
      }),
      t.Null(),
    ])
  ),
});
export type CalendarModelForCreation = typeof calendarModelForCreation.static;

export const calendarCreateBody = t.Omit(calendarModelForCreation, [
  "owner_user_id",
]);
export type CalendarCreateBody = typeof calendarCreateBody.static;

export const calendarUpdateBody = t.Object({
  id: t.Integer(),
  name: t.Optional(t.String()),
  description: t.Optional(t.String()),
  color: t.Optional(t.String()),
  external_source_name: t.Optional(t.Union([t.String(), t.Null()])),
  external_source_url: t.Optional(t.Union([t.String(), t.Null()])),
});
export type CalendarUpdateBody = typeof calendarUpdateBody.static;

export const calendarModelForUpdate = t.Omit(calendarUpdateBody, ["id"]);
export type CalendarModelForUpdate = typeof calendarModelForUpdate.static;
