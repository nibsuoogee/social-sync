import { Calendar, CalendarModelForCreation } from "@shared/index";
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
