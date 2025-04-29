/**
 * Event Attendance Data Transfer Object
 */
export declare const AttendanceDTO: {
    recordAttendance: (attendance: AttendanceModelForCreation) => Promise<Attendance>;
    getAttendances: (event_id: number) => Promise<AttendanceDetails[]>;
    updateAttendance: (attendance: AttendanceUpdateBody) => Promise<Attendance>;
};
export declare const attendanceModelForCreation: import("@sinclair/typebox").TObject<{
    event_id: import("@sinclair/typebox").TInteger;
    membership_id: import("@sinclair/typebox").TInteger;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TEnum<{
        accepted: "accepted";
        declined: "declined";
        tentative: "tentative";
        "needs-action": "needs-action";
    }>>;
}>;
export type AttendanceModelForCreation = typeof attendanceModelForCreation.static;
export declare const attendanceModel: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TInteger;
    event_id: import("@sinclair/typebox").TInteger;
    membership_id: import("@sinclair/typebox").TInteger;
    status: import("@sinclair/typebox").TEnum<{
        accepted: "accepted";
        declined: "declined";
        tentative: "tentative";
        "needs-action": "needs-action";
    }>;
}>;
export type Attendance = typeof attendanceModel.static;
export declare const attendanceDetailsModel: import("@sinclair/typebox").TObject<{
    user_id: import("@sinclair/typebox").TInteger;
    username: import("@sinclair/typebox").TString;
    membership_id: import("@sinclair/typebox").TInteger;
    role: import("@sinclair/typebox").TEnum<{
        owner: "owner";
        member: "member";
    }>;
    color: import("@sinclair/typebox").TString;
    status: import("@sinclair/typebox").TEnum<{
        accepted: "accepted";
        declined: "declined";
        tentative: "tentative";
        "needs-action": "needs-action";
    }>;
}>;
export type AttendanceDetails = typeof attendanceDetailsModel.static;
export declare const attendanceUpdateModel: import("@sinclair/typebox").TObject<{
    user_id: import("@sinclair/typebox").TInteger;
    event_id: import("@sinclair/typebox").TInteger;
    membership_id: import("@sinclair/typebox").TInteger;
    status: import("@sinclair/typebox").TEnum<{
        accepted: "accepted";
        declined: "declined";
        tentative: "tentative";
        "needs-action": "needs-action";
    }>;
}>;
export type AttendanceUpdateModel = typeof attendanceUpdateModel.static;
export declare const attendanceUpdateBody: import("@sinclair/typebox").TObject<{
    status: import("@sinclair/typebox").TEnum<{
        accepted: "accepted";
        declined: "declined";
        tentative: "tentative";
        "needs-action": "needs-action";
    }>;
    event_id: import("@sinclair/typebox").TInteger;
    membership_id: import("@sinclair/typebox").TInteger;
}>;
export type AttendanceUpdateBody = typeof attendanceUpdateBody.static;
