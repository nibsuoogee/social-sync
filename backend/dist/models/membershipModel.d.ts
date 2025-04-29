/**
 * Calendar Membership Data Transfer Object
 */
export declare const MembershipDTO: {
    createMembership: (membership: MembershipModelForCreation) => Promise<Membership>;
    hasMembership: (calendar_id: number, user_id: number) => Promise<boolean>;
    userOwnsThisMembership: (membership_id: number, user_id: number) => Promise<boolean>;
    getIdByUserAndCalendar: (calendar_id: number, user_id: number) => Promise<number>;
    getMembers: (calendar_id: number) => Promise<GroupMemberInfo[]>;
    getMemberships: (calendar_id: number) => Promise<Membership[]>;
    updateColor: (calendar_id: number, user_id: number, color: string) => Promise<Membership>;
    setNewOwner: (calendar_id: number) => Promise<Membership>;
    deleteMembership: (calendar_id: number, user_id: number) => Promise<Membership>;
};
export declare const membershipModelForCreation: import("@sinclair/typebox").TObject<{
    calendar_id: import("@sinclair/typebox").TInteger;
    user_id: import("@sinclair/typebox").TInteger;
    role: import("@sinclair/typebox").TEnum<{
        owner: "owner";
        member: "member";
    }>;
    color: import("@sinclair/typebox").TString;
}>;
export type MembershipModelForCreation = typeof membershipModelForCreation.static;
export declare const membershipModel: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TInteger;
    calendar_id: import("@sinclair/typebox").TInteger;
    user_id: import("@sinclair/typebox").TInteger;
    role: import("@sinclair/typebox").TEnum<{
        owner: "owner";
        member: "member";
    }>;
    color: import("@sinclair/typebox").TString;
}>;
export type Membership = typeof membershipModel.static;
export declare const groupMemberInfo: import("@sinclair/typebox").TObject<{
    username: import("@sinclair/typebox").TString;
    email: import("@sinclair/typebox").TString;
    id: import("@sinclair/typebox").TInteger;
    calendar_id: import("@sinclair/typebox").TInteger;
    user_id: import("@sinclair/typebox").TInteger;
    role: import("@sinclair/typebox").TEnum<{
        owner: "owner";
        member: "member";
    }>;
    color: import("@sinclair/typebox").TString;
}>;
export type GroupMemberInfo = typeof groupMemberInfo.static;
export declare const membershipColorUpdateBody: import("@sinclair/typebox").TObject<{
    calendar_id: import("@sinclair/typebox").TInteger;
    color: import("@sinclair/typebox").TString;
}>;
export type MembershipColorUpdateBody = typeof membershipColorUpdateBody.static;
