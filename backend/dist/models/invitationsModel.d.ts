/**
 *  Invitation Data Transfer Object
 */
export declare const InvitationDTO: {
    createInvitation: (invitation: InvitationModelForCreation) => Promise<Invitation>;
    getNewInvitations: (user_id: number) => Promise<NewInvitationsResponse[]>;
    updateInvitation: (invitation: InvitationModelForUpdate) => Promise<Invitation>;
    findUserIdbyEmail: (email: string) => Promise<number>;
};
export declare const invitationModelForCreation: import("@sinclair/typebox").TObject<{
    calendar_id: import("@sinclair/typebox").TInteger;
    user_id: import("@sinclair/typebox").TInteger;
}>;
export type InvitationModelForCreation = typeof invitationModelForCreation.static;
export declare const invitationModelForUpdate: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TInteger;
    user_id: import("@sinclair/typebox").TInteger;
    status: import("@sinclair/typebox").TEnum<{
        accepted: "accepted";
        declined: "declined";
        "needs-action": "needs-action";
    }>;
}>;
export type InvitationModelForUpdate = typeof invitationModelForUpdate.static;
export declare const invitationModel: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TInteger;
    calendar_id: import("@sinclair/typebox").TInteger;
    user_id: import("@sinclair/typebox").TInteger;
    status: import("@sinclair/typebox").TEnum<{
        accepted: "accepted";
        declined: "declined";
        "needs-action": "needs-action";
    }>;
    created_at: import("@sinclair/typebox").TDate;
}>;
export type Invitation = typeof invitationModel.static;
export declare const newInvitationsResponse: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TInteger;
    calendar_id: import("@sinclair/typebox").TInteger;
    name: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    members: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        username: import("@sinclair/typebox").TString;
        email: import("@sinclair/typebox").TString;
    }>>;
}>;
export type NewInvitationsResponse = typeof newInvitationsResponse.static;
export declare const invitationBody: import("@sinclair/typebox").TObject<{
    email: import("@sinclair/typebox").TString;
    calendar_id: import("@sinclair/typebox").TInteger;
}>;
export type InvitationBody = typeof invitationBody.static;
export declare const invitationUpdateBody: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TInteger;
    status: import("@sinclair/typebox").TEnum<{
        accepted: "accepted";
        declined: "declined";
        "needs-action": "needs-action";
    }>;
}>;
export type InvitationUpdateBody = typeof invitationUpdateBody.static;
