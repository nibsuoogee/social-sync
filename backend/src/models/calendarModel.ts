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
    const calendars = await sql`SELECT * FROM calendars 
      WHERE owner_user_id = ${user_id}`;
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
};

export const calendarModelForCreation = t.Object({
  name: t.String(),
  description: t.String(),
  owner_user_id: t.Integer(), // get this from the jwt token
  is_group: t.Boolean(),
  color: t.String(),
});
export type CalendarModelForCreation = typeof calendarModelForCreation.static;

export const calendarModel = t.Object({
  id: t.Integer(),
  name: t.String(),
  description: t.String(),
  owner_user_id: t.Integer(), // get this from the jwt token
  is_group: t.Boolean(),
  created_at: t.Date(),
  color: t.String(),
});
export type Calendar = typeof calendarModel.static;

export const calendarCreateBody = t.Object({
  name: t.String(),
  description: t.String(),
  is_group: t.Boolean(),
  color: t.String(),
});
export type CalendarCreateBody = typeof calendarCreateBody.static;

export const calendarUpdateBody = t.Object({
  id: t.Integer(),
  name: t.String(),
  description: t.String(),
  color: t.String(),
});
export type CalendarUpdateBody = typeof calendarUpdateBody.static;

export const calendarModelForUpdate = t.Object({
  name: t.String(),
  description: t.String(),
  color: t.String(),
});
export type CalendarModelForUpdate = typeof calendarModelForUpdate.static;
