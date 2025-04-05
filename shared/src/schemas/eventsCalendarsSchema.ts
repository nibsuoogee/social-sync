import { t } from "elysia";

export const eventsCalendarsModel = t.Object({
  events_id: t.Integer(),
  calendars_id: t.Integer(),
});
export type EventsCalendars = typeof eventsCalendarsModel.static;
