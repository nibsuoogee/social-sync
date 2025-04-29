import { sql } from "bun";
import { t } from "elysia";
import { eventModel } from "@models/eventsModel";
/**
 * Calendar Data Transfer Object
 */
export const CalendarDTO = {
    createCalendar: async (calendar) => {
        const [newCalendar] = await sql `
      INSERT INTO calendars ${sql(calendar)}
      RETURNING *
    `;
        return newCalendar;
    },
    getCalendars: async (user_id) => {
        const calendars = await sql `
      SELECT calendars.*
      FROM calendars
      JOIN memberships ON calendars.id = memberships.calendar_id
      WHERE memberships.user_id = ${user_id}`;
        return [...calendars];
    },
    getCalendarsExcludeOne: async (user_id, excludeCalendarId) => {
        const calendars = await sql `
      SELECT calendars.*
      FROM calendars
      JOIN memberships ON calendars.id = memberships.calendar_id
      WHERE memberships.user_id = ${user_id}
      AND calendars.id <> ${excludeCalendarId}`;
        return [...calendars];
    },
    getCalendar: async (calendar_id) => {
        const [calendar] = await sql `
      SELECT * FROM calendars
      WHERE id = ${calendar_id}
    `;
        return calendar;
    },
    getPersonalCalendars: async (user_id) => {
        const calendars = await sql `
      SELECT * FROM calendars
      WHERE owner_user_id = ${user_id}
      AND is_group = false
    `;
        return [...calendars];
    },
    updateCalendar: async (calendar_id, calendar) => {
        const [newCalendar] = await sql `
      UPDATE calendars SET ${sql(calendar)}
      WHERE id = ${calendar_id}
      RETURNING *
    `;
        return newCalendar;
    },
    deleteCalendar: async (calendar_id) => {
        const [deletedCalendar] = await sql `
      DELETE FROM calendars 
      WHERE id = ${calendar_id}
      RETURNING *;
    `;
        return deletedCalendar;
    },
    isCalendarOwner: async (calendar_id, owner_user_id) => {
        const [result] = await sql `
      SELECT EXISTS(SELECT 1 FROM calendars 
      WHERE id = ${calendar_id} AND owner_user_id = ${owner_user_id})`;
        return result;
    },
    findByOwnerAndUrl: async (ownerUserId, externalSourceUrl) => {
        const [calendar] = await sql `
      SELECT * FROM calendars
      WHERE owner_user_id = ${ownerUserId} AND external_source_url = ${externalSourceUrl}
      LIMIT 1
    `;
        return calendar || null;
    },
    findAllWithExternalSource: async (ownerUserId) => {
        const calendars = await sql `
      SELECT * FROM calendars
      WHERE owner_user_id = ${ownerUserId} AND external_source_url IS NOT NULL
    `;
        return calendars;
    },
    updateLastSync: async (calendarId, date) => {
        await sql `
      UPDATE calendars
      SET external_last_sync = ${date}
      WHERE id = ${calendarId}
    `;
    },
};
export const calendarModel = t.Object({
    id: t.Integer(),
    name: t.String(),
    description: t.String(),
    owner_user_id: t.Integer(), // get this from the jwt token
    is_group: t.Boolean(),
    created_at: t.Date(),
    color: t.String(),
    external_source_name: t.Optional(t.Union([t.String(), t.Null()])),
    external_source_url: t.Optional(t.Union([t.String(), t.Null()])),
    external_last_sync: t.Optional(t.Union([t.Date(), t.Null()])),
    external_sync_status: t.Optional(t.Union([
        t.Enum({
            inactive: "inactive",
            active: "active",
            failed: "failed",
        }),
        t.Null(),
    ])),
});
export const calendarModelForCreation = t.Object({
    name: t.String(),
    description: t.String(),
    owner_user_id: t.Integer(),
    is_group: t.Boolean(),
    color: t.String(),
    external_source_name: t.Optional(t.Union([t.String(), t.Null()])),
    external_source_url: t.Optional(t.Union([t.String(), t.Null()])),
    external_last_sync: t.Optional(t.Union([t.Date(), t.Null()])),
    external_sync_status: t.Optional(t.Union([
        t.Enum({
            inactive: "inactive",
            active: "active",
            failed: "failed",
        }),
        t.Null(),
    ])),
});
export const calendarCreateBody = t.Omit(calendarModelForCreation, [
    "owner_user_id",
]);
export const calendarUpdateBody = t.Object({
    id: t.Integer(),
    name: t.Optional(t.String()),
    description: t.Optional(t.String()),
    color: t.Optional(t.String()),
    external_source_name: t.Optional(t.Union([t.String(), t.Null()])),
    external_source_url: t.Optional(t.Union([t.String(), t.Null()])),
});
export const calendarModelForUpdate = t.Omit(calendarUpdateBody, ["id"]);
export const calendarAndEvents = t.Object({
    calendar: calendarModel,
    events: t.Array(eventModel),
});
export const calendarViewRequest = t.Object({
    mainCalendar: t.Array(calendarAndEvents),
    personalCalendars: t.Array(calendarAndEvents),
    groupMemberCalendars: t.Array(calendarAndEvents),
});
export const defaultCalendar = {
    id: -1,
    name: "",
    description: "",
    owner_user_id: -1,
    is_group: false,
    created_at: new Date(),
    color: "#000000",
};
