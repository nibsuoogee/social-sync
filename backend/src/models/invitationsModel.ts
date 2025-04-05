import { sql } from "bun";
import {
  Invitation,
  InvitationModelForCreation,
  InvitationModelForUpdate,
} from "@shared/index";

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
  checkCalendarOwner: async (id: number): Promise<Number> => {
    const [calendar_id] = await sql`
    SELECT id FROM calendars WHERE owner_user_id = ${id}
    `;
    return calendar_id.id;
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
