import { t } from "elysia";

export const eventModelForCreation = t.Object({
  ics_uid: t.String(),
  title: t.String(),
  description: t.Optional(t.String()),
  location: t.Optional(t.String()),
  start_time: t.String(), // ISO timestamp string
  end_time: t.String(), // ISO timestamp string
  timezone: t.String().Default("UTC"),
  all_day: t.Boolean().Default(false),
  recurrence_rule: t.Optional(t.String()),
  status: t
    .Enum({
      confirmed: "confirmed",
      tentative: "tentative",
      cancelled: "cancelled",
    })
    .Default("confirmed"),
  proposed_by_user_id: t.Integer(),
});
export type EventModelForCreation = typeof eventModelForCreation.static;

export const eventModel = t.Object({
  id: t.Integer(),
  ics_uid: t.String(),
  title: t.String(),
  description: t.Optional(t.String()),
  location: t.Optional(t.String()),
  start_time: t.String(),
  end_time: t.String(),
  timezone: t.String(),
  all_day: t.Boolean(),
  recurrence_rule: t.Optional(t.String()),
  status: t.Enum({
    confirmed: "confirmed",
    tentative: "tentative",
    cancelled: "cancelled",
  }),
  created_at: t.String(), // ISO timestamp
  updated_at: t.String(), // ISO timestamp
  proposed_by_user_id: t.Integer(),
});
export type Event = typeof eventModel.static;
