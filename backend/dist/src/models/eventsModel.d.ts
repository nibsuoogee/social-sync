/**
 * Event Data Transfer Object
 */
export declare const EventDTO: {
    createEvent: (event: EventModelForCreation) => Promise<Event>;
    getEvents: (calendar_id: number) => Promise<Event[]>;
    updateEvent: (event_id: number, event: EventModelForUpdate) => Promise<Event>;
    deleteEvent: (event_id: number) => Promise<Event>;
    canModify: (event_id: number, proposed_by_user_id: number) => Promise<boolean>;
    findByUidAndCalendar: (uid: string, calendarId: number) => Promise<Event | null>;
};
export declare const eventModelForCreation: import("@sinclair/typebox").TObject<{
    ics_uid: import("@sinclair/typebox").TString;
    calendar_id: import("@sinclair/typebox").TInteger;
    title: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    location: import("@sinclair/typebox").TString;
    start_time: import("@sinclair/typebox").TDate;
    end_time: import("@sinclair/typebox").TDate;
    timezone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    all_day: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    recurrence_rule: import("@sinclair/typebox").TString;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
        confirmed: "confirmed";
        tentative: "tentative";
        cancelled: "cancelled";
    }>>;
    proposed_by_user_id: import("@sinclair/typebox").TInteger;
    user_read_only: import("@sinclair/typebox").TBoolean;
}>;
export type EventModelForCreation = typeof eventModelForCreation.static;
export declare const eventModel: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TInteger;
    ics_uid: import("@sinclair/typebox").TString;
    title: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    location: import("@sinclair/typebox").TString;
    start_time: import("@sinclair/typebox").TDate;
    end_time: import("@sinclair/typebox").TDate;
    timezone: import("@sinclair/typebox").TString;
    all_day: import("@sinclair/typebox").TBoolean;
    recurrence_rule: import("@sinclair/typebox").TString;
    status: import("@sinclair/typebox").TEnum<{
        confirmed: "confirmed";
        tentative: "tentative";
        cancelled: "cancelled";
    }>;
    created_at: import("@sinclair/typebox").TDate;
    updated_at: import("@sinclair/typebox").TDate;
    proposed_by_user_id: import("@sinclair/typebox").TInteger;
    user_read_only: import("@sinclair/typebox").TBoolean;
}>;
export type Event = typeof eventModel.static;
export declare const eventModelBody: import("@sinclair/typebox").TObject<{
    calendar_id: import("@sinclair/typebox").TInteger;
    ics_uid: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    title: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    location: import("@sinclair/typebox").TString;
    start_time: import("@sinclair/typebox").TDate;
    end_time: import("@sinclair/typebox").TDate;
    timezone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    all_day: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    recurrence_rule: import("@sinclair/typebox").TString;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
        confirmed: "confirmed";
        tentative: "tentative";
        cancelled: "cancelled";
    }>>;
}>;
export type EventModelBody = typeof eventModelBody.static;
export declare const eventUpdateBody: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TInteger;
    title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    location: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    start_time: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    end_time: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    timezone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    all_day: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    recurrence_rule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
        confirmed: "confirmed";
        tentative: "tentative";
        cancelled: "cancelled";
    }>>;
}>;
export type EventUpdateBody = typeof eventUpdateBody.static;
export declare const eventModelForUpdate: import("@sinclair/typebox").TObject<{
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
        confirmed: "confirmed";
        tentative: "tentative";
        cancelled: "cancelled";
    }>>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    location: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    start_time: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    end_time: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TDate>;
    timezone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    all_day: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    recurrence_rule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type EventModelForUpdate = typeof eventModelForUpdate.static;
