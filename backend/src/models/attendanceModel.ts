import { Attendance, AttendanceModelForCreation } from "@shared/index";
import { sql } from "bun";

/**
 * Event Attendance Data Transfer Object
 */
export const AttendanceDTO = {
  recordAttendance: async (
    attendance: AttendanceModelForCreation
  ): Promise<Attendance> => {
    const [newAttendance] = await sql`
      INSERT INTO event_attendance ${sql(attendance)}
      RETURNING *
    `;
    return newAttendance;
  },
};
