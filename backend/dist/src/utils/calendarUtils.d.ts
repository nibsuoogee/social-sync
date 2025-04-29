import { VEvent } from "node-ical";
import { Event } from "../models/eventsModel";
import { Calendar } from "@models/calendarModel";
export declare const filterUpcomingEvents: (events: VEvent[], daysAhead: number) => VEvent[];
export declare const addOrUpdateEvent: (event: VEvent, calendarId: number, userId: number) => Promise<{
    updated: boolean;
    added: boolean;
}>;
export declare const createIcsFile: (events: Event[], calendar: Calendar) => string;
