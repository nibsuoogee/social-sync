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
        users.id AS user_id,
        users.username,
        memberships.id AS membership_id,
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
  updateAttendance: async (
    attendance: AttendanceUpdateBody
  ): Promise<Attendance> => {
    const [updatedAttendance] = await sql`
      UPDATE event_attendance 
      SET status = ${attendance.status} 
      WHERE membership_id = ${attendance.membership_id} 
      AND event_id = ${attendance.event_id} 
      RETURNING *
      `;
    return updatedAttendance;
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
  user_id: t.Integer(),
  username: t.String(),
  membership_id: t.Integer(),
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

export const attendanceUpdateModel = t.Object({
  user_id: t.Integer(),
  event_id: t.Integer(),
  membership_id: t.Integer(),
  status: t.Enum({
    accepted: "accepted",
    declined: "declined",
    tentative: "tentative",
    "needs-action": "needs-action",
  }),
});
export type AttendanceUpdateModel = typeof attendanceUpdateModel.static;

export const attendanceUpdateBody = t.Omit(attendanceUpdateModel, ["user_id"]);
export type AttendanceUpdateBody = typeof attendanceUpdateBody.static;
