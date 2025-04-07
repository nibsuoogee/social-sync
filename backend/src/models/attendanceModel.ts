import { sql } from "bun";
import { t } from "elysia";

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

export const attendanceModelForCreation = t.Object({
  event_id: t.Integer(),
  user_id: t.Integer(),
  status: t.Optional(
    t.Enum({
      accepted: "accepted",
      declined: "declined",
      tentative: "tentative",
      "needs-action": "needs-action",
    })
  ),
});
export type AttendanceModelForCreation =
  typeof attendanceModelForCreation.static;

export const attendanceModel = t.Object({
  id: t.Integer(),
  event_id: t.Integer(),
  user_id: t.Integer(),
  status: t.Enum({
    accepted: "accepted",
    declined: "declined",
    tentative: "tentative",
    "needs-action": "needs-action",
  }),
});
export type Attendance = typeof attendanceModel.static;
