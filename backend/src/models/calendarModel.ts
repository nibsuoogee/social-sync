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
};

export const calendarModelForCreation = t.Object({
  name: t.String(),
  description: t.String(),
  owner_user_id: t.Integer(), // get this from the jwt token
  is_group: t.Boolean(),
});
export type CalendarModelForCreation = typeof calendarModelForCreation.static;

export const calendarModel = t.Object({
  id: t.Integer(),
  name: t.String(),
  description: t.String(),
  owner_user_id: t.Integer(), // get this from the jwt token
  is_group: t.Boolean(),
  created_at: t.Date(),
});
export type Calendar = typeof calendarModel.static;
