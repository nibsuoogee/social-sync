/**
 * Calendar Data Transfer Object
 */
export declare const CalendarDTO: {
    createCalendar: (calendar: CalendarModelForCreation) => Promise<Calendar>;
    getCalendars: (user_id: number) => Promise<Calendar[]>;
    getCalendarsExcludeOne: (user_id: number, excludeCalendarId: number) => Promise<Calendar[]>;
    getCalendar: (calendar_id: number) => Promise<Calendar>;
    getPersonalCalendars: (user_id: number) => Promise<Calendar[]>;
    updateCalendar: (calendar_id: number, calendar: CalendarModelForUpdate) => Promise<Calendar>;
    deleteCalendar: (calendar_id: number) => Promise<Calendar>;
    isCalendarOwner: (calendar_id: number, owner_user_id: number) => Promise<boolean>;
    findByOwnerAndUrl: (ownerUserId: number, externalSourceUrl: string) => Promise<Calendar | null>;
    findAllWithExternalSource: (ownerUserId: number) => Promise<Calendar[]>;
    updateLastSync: (calendarId: number, date: Date) => Promise<void>;
};
export declare const calendarModel: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TInteger;
    name: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    owner_user_id: import("@sinclair/typebox").TInteger;
    is_group: import("@sinclair/typebox").TBoolean;
    created_at: import("@sinclair/typebox").TDate;
    color: import("@sinclair/typebox").TString;
    external_source_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    external_source_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    external_last_sync: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
    external_sync_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
        inactive: "inactive";
        active: "active";
        failed: "failed";
    }>, import("@sinclair/typebox").TNull]>>;
}>;
export type Calendar = typeof calendarModel.static;
export declare const calendarModelForCreation: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    owner_user_id: import("@sinclair/typebox").TInteger;
    is_group: import("@sinclair/typebox").TBoolean;
    color: import("@sinclair/typebox").TString;
    external_source_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    external_source_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    external_last_sync: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
    external_sync_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
        inactive: "inactive";
        active: "active";
        failed: "failed";
    }>, import("@sinclair/typebox").TNull]>>;
}>;
export type CalendarModelForCreation = typeof calendarModelForCreation.static;
export declare const calendarCreateBody: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    color: import("@sinclair/typebox").TString;
    is_group: import("@sinclair/typebox").TBoolean;
    external_source_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    external_source_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    external_last_sync: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
    external_sync_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
        inactive: "inactive";
        active: "active";
        failed: "failed";
    }>, import("@sinclair/typebox").TNull]>>;
}>;
export type CalendarCreateBody = typeof calendarCreateBody.static;
export declare const calendarUpdateBody: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TInteger;
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    color: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    external_source_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    external_source_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
}>;
export type CalendarUpdateBody = typeof calendarUpdateBody.static;
export declare const calendarModelForUpdate: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    color: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    external_source_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
    external_source_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
}>;
export type CalendarModelForUpdate = typeof calendarModelForUpdate.static;
export declare const calendarAndEvents: import("@sinclair/typebox").TObject<{
    calendar: import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TInteger;
        name: import("@sinclair/typebox").TString;
        description: import("@sinclair/typebox").TString;
        owner_user_id: import("@sinclair/typebox").TInteger;
        is_group: import("@sinclair/typebox").TBoolean;
        created_at: import("@sinclair/typebox").TDate;
        color: import("@sinclair/typebox").TString;
        external_source_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        external_source_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
        external_last_sync: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
        external_sync_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
            inactive: "inactive";
            active: "active";
            failed: "failed";
        }>, import("@sinclair/typebox").TNull]>>;
    }>;
    events: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
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
    }>>;
}>;
export type CalendarAndEvents = typeof calendarAndEvents.static;
export declare const calendarViewRequest: import("@sinclair/typebox").TObject<{
    mainCalendar: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        calendar: import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TInteger;
            name: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TString;
            owner_user_id: import("@sinclair/typebox").TInteger;
            is_group: import("@sinclair/typebox").TBoolean;
            created_at: import("@sinclair/typebox").TDate;
            color: import("@sinclair/typebox").TString;
            external_source_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            external_source_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            external_last_sync: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
            external_sync_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
                inactive: "inactive";
                active: "active";
                failed: "failed";
            }>, import("@sinclair/typebox").TNull]>>;
        }>;
        events: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
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
        }>>;
    }>>;
    personalCalendars: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        calendar: import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TInteger;
            name: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TString;
            owner_user_id: import("@sinclair/typebox").TInteger;
            is_group: import("@sinclair/typebox").TBoolean;
            created_at: import("@sinclair/typebox").TDate;
            color: import("@sinclair/typebox").TString;
            external_source_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            external_source_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            external_last_sync: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
            external_sync_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
                inactive: "inactive";
                active: "active";
                failed: "failed";
            }>, import("@sinclair/typebox").TNull]>>;
        }>;
        events: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
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
        }>>;
    }>>;
    groupMemberCalendars: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        calendar: import("@sinclair/typebox").TObject<{
            id: import("@sinclair/typebox").TInteger;
            name: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TString;
            owner_user_id: import("@sinclair/typebox").TInteger;
            is_group: import("@sinclair/typebox").TBoolean;
            created_at: import("@sinclair/typebox").TDate;
            color: import("@sinclair/typebox").TString;
            external_source_name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            external_source_url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull]>>;
            external_last_sync: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TDate, import("@sinclair/typebox").TNull]>>;
            external_sync_status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TEnum<{
                inactive: "inactive";
                active: "active";
                failed: "failed";
            }>, import("@sinclair/typebox").TNull]>>;
        }>;
        events: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
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
        }>>;
    }>>;
}>;
/**
 * In the UI,
 * 1) the mainCalendar is the one that new events will be added to (and
 *    other event CRUD operations)
 * 2) personalCalendars events can be navigated to for editing
 * 3) and groupMemberCalendars evetns cannot be modified or accessed.
 *
 * In other words, personal and group member calendars supplement the
 * calendar view and allow to plan around the events being modified in the
 * mainCalendar.
 */
export type CalendarViewRequest = typeof calendarViewRequest.static;
export declare const defaultCalendar: Calendar;
