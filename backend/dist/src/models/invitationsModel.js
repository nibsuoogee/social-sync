import { sql } from "bun";
import { t } from "elysia";
/**
 *  Invitation Data Transfer Object
 */
export const InvitationDTO = {
    createInvitation: async (invitation) => {
        const [newInvitation] = await sql `
    INSERT INTO invitations ${sql(invitation)} 
    RETURNING *
    `;
        return newInvitation;
    },
    getNewInvitations: async (user_id) => {
        const invitations = await sql `
      SELECT * FROM invitations 
      WHERE user_id = ${user_id}
      AND status = 'needs-action'
    `;
        return await Promise.all(invitations.map(async (invitation) => {
            // selecting the required fields from calendar
            const calendar = await sql `
          SELECT name, description
          FROM calendars
          WHERE id = ${invitation.calendar_id}
        `;
            // getting the current members of the calendar
            const members = await sql `
          SELECT users.username, users.email
          FROM memberships
          JOIN users ON memberships.user_id = users.id
          WHERE memberships.calendar_id = ${invitation.calendar_id}
        `;
            // pushing the required fields to the result array
            const invitationResponse = {
                id: invitation.id,
                calendar_id: invitation.calendar_id,
                name: calendar[0].name,
                description: calendar[0].description,
                members: members.map((m) => ({
                    username: m.username,
                    email: m.email,
                })),
            };
            return invitationResponse;
        }));
    },
    updateInvitation: async (invitation) => {
        const [updatedInvitation] = await sql `
    UPDATE invitations 
    SET status = ${invitation.status} 
    WHERE id = ${invitation.id} AND user_id = ${invitation.user_id} 
    RETURNING *
    `;
        return updatedInvitation;
    },
    findUserIdbyEmail: async (email) => {
        const [user_id] = await sql `
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
export const invitationModelForUpdate = t.Object({
    id: t.Integer(), // invite id
    user_id: t.Integer(),
    status: t.Enum({
        accepted: "accepted",
        declined: "declined",
        "needs-action": "needs-action",
    }),
});
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
export const newInvitationsResponse = t.Object({
    id: t.Integer(), // invitation id
    calendar_id: t.Integer(), // calendar where the user is invited to
    name: t.String(), // calendar name
    description: t.String(), // calendar name
    members: t.Array(t.Object({
        username: t.String(),
        email: t.String(),
    })), // members of the calendar
});
export const invitationBody = t.Object({
    email: t.String(), // invited users email
    calendar_id: t.Integer(), // calendar where the user is invited to
});
export const invitationUpdateBody = t.Object({
    id: t.Integer(), // invite id
    status: t.Enum({
        accepted: "accepted",
        declined: "declined",
        "needs-action": "needs-action",
    }),
});
