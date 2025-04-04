import { t } from "elysia";

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
