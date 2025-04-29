import { t } from "elysia";
import { sql } from "bun";
/**
 * Calendar Membership Data Transfer Object
 */
export const MembershipDTO = {
    createMembership: async (membership) => {
        const [newMembership] = await sql `
      INSERT INTO memberships ${sql(membership)}
      RETURNING *
    `;
        return newMembership;
    },
    hasMembership: async (calendar_id, user_id) => {
        const [result] = await sql `
      SELECT EXISTS(SELECT 1 FROM memberships 
      WHERE calendar_id = ${calendar_id} 
      AND user_id = ${user_id})`;
        return result.exists;
    },
    userOwnsThisMembership: async (membership_id, user_id) => {
        const [result] = await sql `
      SELECT EXISTS(SELECT 1 FROM memberships 
      WHERE id = ${membership_id} 
      AND user_id = ${user_id})`;
        return result.exists;
    },
    getIdByUserAndCalendar: async (calendar_id, user_id) => {
        const [result] = await sql `
      SELECT id FROM memberships 
      WHERE calendar_id = ${calendar_id} 
      AND user_id = ${user_id}`;
        return result.id;
    },
    getMembers: async (calendar_id) => {
        const members = await sql `
      SELECT users.username, users.email, memberships.*
      FROM users
      JOIN memberships ON users.id = memberships.user_id
      WHERE memberships.calendar_id = ${calendar_id}`;
        return [...members];
    },
    getMemberships: async (calendar_id) => {
        const members = await sql `
      SELECT * FROM memberships
      WHERE calendar_id = ${calendar_id}`;
        return [...members];
    },
    updateColor: async (calendar_id, user_id, color) => {
        const [newMembership] = await sql `
      UPDATE memberships SET color = ${color}
      WHERE calendar_id = ${calendar_id}
      AND user_id = ${user_id}
      RETURNING *
    `;
        return newMembership;
    },
    setNewOwner: async (calendar_id) => {
        const [newOwner] = await sql `
      WITH random_member AS (
        SELECT * FROM memberships
        WHERE calendar_id = ${calendar_id}
        AND role != 'owner'
        ORDER BY RANDOM()
        LIMIT 1
      )
      UPDATE memberships
      SET role = 'owner'
      FROM random_member
      WHERE memberships.id = random_member.id
      RETURNING memberships.*
    `;
        return newOwner;
    },
    deleteMembership: async (calendar_id, user_id) => {
        const [deletedMembership] = await sql `
      DELETE FROM memberships
      WHERE calendar_id = ${calendar_id}
      AND user_id = ${user_id}
      RETURNING *`;
        return deletedMembership;
    },
};
export const membershipModelForCreation = t.Object({
    calendar_id: t.Integer(),
    user_id: t.Integer(), // get this from the jwt token
    role: t.Enum({ owner: "owner", member: "member" }),
    color: t.String(),
});
export const membershipModel = t.Object({
    id: t.Integer(),
    calendar_id: t.Integer(),
    user_id: t.Integer(),
    role: t.Enum({ owner: "owner", member: "member" }),
    color: t.String(),
});
export const groupMemberInfo = t.Object({
    username: t.String(),
    email: t.String(),
    id: t.Integer(),
    calendar_id: t.Integer(),
    user_id: t.Integer(),
    role: t.Enum({ owner: "owner", member: "member" }),
    color: t.String(),
});
export const membershipColorUpdateBody = t.Object({
    calendar_id: t.Integer(),
    color: t.String(),
});
