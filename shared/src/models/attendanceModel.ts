import { t } from "elysia";

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
