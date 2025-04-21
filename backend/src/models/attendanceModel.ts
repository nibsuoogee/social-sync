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
  getAttendances: async (event_id: number): Promise<AttendanceDetails[]> => {
    const attendances = await sql`
      SELECT
        users.username,
        memberships.role,
        memberships.color,
        event_attendance.status
      FROM event_attendance
      JOIN memberships ON event_attendance.membership_id = memberships.id
      JOIN users ON memberships.user_id = users.id
      WHERE event_attendance.event_id = ${event_id};
    `;
    return [...attendances];
  },
};

export const attendanceModelForCreation = t.Object({
  event_id: t.Integer(),
  membership_id: t.Integer(),
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
  membership_id: t.Integer(),
  status: t.Enum({
    accepted: "accepted",
    declined: "declined",
    tentative: "tentative",
    "needs-action": "needs-action",
  }),
});
export type Attendance = typeof attendanceModel.static;

export const attendanceDetailsModel = t.Object({
  username: t.String(),
  role: t.Enum({ owner: "owner", member: "member" }),
  color: t.String(),
  status: t.Enum({
    accepted: "accepted",
    declined: "declined",
    tentative: "tentative",
    "needs-action": "needs-action",
  }),
});
export type AttendanceDetails = typeof attendanceDetailsModel.static;
