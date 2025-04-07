import { sql } from "bun";
import { t } from "elysia";

/**
 *  Invitation Data Transfer Object
 */
export const InvitationDTO = {
  createInvitation: async (
    invitation: InvitationModelForCreation
  ): Promise<Invitation> => {
    const [newInvitation] = await sql`
    INSERT INTO invitations ${sql(invitation)} 
    RETURNING *
    `;
    return newInvitation;
  },
  updateInvitation: async (
    invitation: InvitationModelForUpdate
  ): Promise<Invitation> => {
    const [updatedInvitation] = await sql`
    UPDATE invitations 
    SET status = ${invitation.status} 
    WHERE id = ${invitation.id} AND user_id = ${invitation.user_id} 
    RETURNING *
    `;
    return updatedInvitation;
  },
  findUserIdbyEmail: async (email: string): Promise<number> => {
    const [user_id] = await sql`
    SELECT id FROM users WHERE email = ${email}
    `;
    return user_id.id;
  },
};

// for creation we only need the calendar_id and user_id since status is default
export const invitationModelForCreation = t.Object({
  calendar_id: t.Integer(),
  user_id: t.Integer(),
});
export type InvitationModelForCreation =
  typeof invitationModelForCreation.static;

export const invitationModelForUpdate = t.Object({
  id: t.Integer(), // invite id
  user_id: t.Integer(),
  status: t.Enum({
    accepted: "accepted",
    declined: "declined",
    "needs-action": "needs-action",
  }),
});
export type InvitationModelForUpdate = typeof invitationModelForUpdate.static;

export const invitationModel = t.Object({
  id: t.Integer(),
  calendar_id: t.Integer(), // calendar where the user is invited to
  user_id: t.Integer(), // user invited to group
  status: t.Enum({
    accepted: "accepted",
    declined: "declined",
    "needs-action": "needs-action",
  }),
  created_at: t.Date(),
});
export type Invitation = typeof invitationModel.static;

export const invitationBody = t.Object({
  email: t.String(), // invited users email
  calendar_id: t.Integer(), // calendar where the user is invited to
});
export type InvitationBody = typeof invitationBody.static;

export const invitationUpdateBody = t.Object({
  id: t.Integer(), // invite id
  status: t.Enum({
    accepted: "accepted",
    declined: "declined",
    "needs-action": "needs-action",
  }),
});
export type InvitationUpdateBody = typeof invitationUpdateBody.static;
