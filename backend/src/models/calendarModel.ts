import { Calendar, CalendarModelForCreation } from "@shared/index";
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
};
