import { Elysia } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import { createIcsFile } from "../utils/calendarUtils";
import { MembershipDTO } from "../models/membershipModel";
import { CalendarDTO } from "../models/calendarModel";
import { EventDTO } from "../models/eventsModel";
import { tryCatch } from "@utils/tryCatch";
export const exportCalendarRouter = new Elysia()
    .use(jwtConfig)
    .derive(authorizationMiddleware)
    .guard({
    beforeHandle: ({ user, error }) => {
        if (!user)
            return error(401, "Not Authorized");
    },
}, (app) => app.get("/calendar/export/:id", async ({ params, user, error }) => {
    const calendarId = Number(params.id);
    if (isNaN(calendarId)) {
        return error(400, "Invalid calendar ID");
    }
    // 1) Check if the user has access to the calendar
    const [hasMembership, errMembership] = await tryCatch(MembershipDTO.hasMembership(calendarId, user.id));
    if (errMembership)
        return error(500, errMembership.message);
    if (!hasMembership)
        return error(401, "Unauthorized access to calendar");
    // 2) Fetch calendar and events
    const [calendar, errCalendar] = await tryCatch(CalendarDTO.getCalendar(calendarId));
    if (errCalendar)
        return error(500, errCalendar.message);
    if (!calendar)
        return error(404, "Calendar not found");
    const [events, errEvents] = await tryCatch(EventDTO.getEvents(calendarId));
    if (errEvents)
        return error(500, errEvents.message);
    // 3) Generate .ics file with events
    const icsContent = createIcsFile(events, calendar);
    // 4) Return generated .ics file
    return new Response(icsContent, {
        headers: {
            "Content-Type": "text/calendar",
            "Content-Disposition": `attachment; filename="${calendar.name}.ics"`,
        },
    });
}));
