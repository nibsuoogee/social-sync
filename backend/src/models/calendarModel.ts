import { t } from "elysia";
import { sql } from "bun";
import { t } from "elysia";

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
  deleteCalendar: async (calendar_id: number): Promise<Calendar> => {
    const [newCalendar] = await sql`
      DELETE FROM calendars 
      WHERE calendar_id = ${calendar_id}
    `;
    return newCalendar;
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

export const calendarModelForUserCreation = t.Object({
  name: t.String(),
  description: t.String(),
  is_group: t.Boolean(),
  color: t.String(),
});
export type CalendarModelForUserCreation =
  typeof calendarModelForUserCreation.static;
