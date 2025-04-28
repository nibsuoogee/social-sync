import { sql } from "bun";
import { t } from "elysia";
import { eventModel } from "@models/eventsModel";

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
  getCalendarsExcludeOne: async (
    user_id: number,
    excludeCalendarId: number
  ): Promise<Calendar[]> => {
    const calendars = await sql`
      SELECT calendars.*
      FROM calendars
      JOIN memberships ON calendars.id = memberships.calendar_id
      WHERE memberships.user_id = ${user_id}
      AND calendars.id <> ${excludeCalendarId}`;
    return [...calendars];
  },
  getCalendar: async (calendar_id: number): Promise<Calendar> => {
    const [calendar] = await sql`
      SELECT * FROM calendars
      WHERE id = ${calendar_id}
    `;
    return calendar;
  },
  getPersonalCalendars: async (user_id: number): Promise<Calendar[]> => {
    const calendars = await sql`
      SELECT * FROM calendars
      WHERE owner_user_id = ${user_id}
      AND is_group = false
    `;
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
  findAllWithExternalSource: async (
    ownerUserId: number
  ): Promise<Calendar[]> => {
    const calendars = await sql`
      SELECT * FROM calendars
      WHERE owner_user_id = ${ownerUserId} AND external_source_url IS NOT NULL
    `;
    return calendars;
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

export const calendarAndEvents = t.Object({
  calendar: calendarModel,
  events: t.Array(eventModel),
});
export type CalendarAndEvents = typeof calendarAndEvents.static;

export const calendarViewRequest = t.Object({
  mainCalendar: t.Array(calendarAndEvents),
  personalCalendars: t.Array(calendarAndEvents),
  groupMemberCalendars: t.Array(calendarAndEvents),
});
/**
 * In the UI,
 * 1) the mainCalendar is the one that new events will be added to (and
 *    other event CRUD operations)
 * 2) personalCalendars events can be navigated to for editing
 * 3) and groupMemberCalendars evetns cannot be modified or accessed.
 *
 * In other words, personal and group member calendars supplement the
 * calendar view and allow to plan around the events being modified in the
 * mainCalendar.
 */
export type CalendarViewRequest = typeof calendarViewRequest.static;

export const defaultCalendar: Calendar = {
  id: -1,
  name: "",
  description: "",
  owner_user_id: -1,
  is_group: false,
  created_at: new Date(),
  color: "#000000",
};
