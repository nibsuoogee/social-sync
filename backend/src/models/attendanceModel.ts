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

export const AttendanceModelForCreation = t.Object({
  event_id: t.Integer(),
  user_id: t.Integer(),
  status: t
    .Enum({
      accepted: "accepted",
      declined: "declined",
      tentative: "tentative",
      "needs-action": "needs-action",
    })
    .Default("needs-action"),
});
export type AttendanceModelForCreation =
  typeof AttendanceModelForCreation.static;

export const AttendanceModel = t.Object({
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
export type Attendance = typeof AttendanceModel.static;
