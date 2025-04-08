import { t } from "elysia";
import { sql } from "bun";

/**
 * Calendar Membership Data Transfer Object
 */
export const MembershipDTO = {
  createMembership: async (
    membership: MembershipModelForCreation
  ): Promise<Membership> => {
    const [newMembership] = await sql`
      INSERT INTO calendar_membership ${sql(membership)}
      RETURNING *
    `;
    return newMembership;
  },
  hasMembership: async (
    calendar_id: number,
    user_id: number
  ): Promise<boolean> => {
    const [result] = await sql`
      SELECT EXISTS(SELECT 1 FROM calendar_membership 
      WHERE calendar_id = ${calendar_id} 
      AND user_id = ${user_id})`;
    return result;
  },
};

export const membershipModelForCreation = t.Object({
  calendar_id: t.Integer(),
  user_id: t.Integer(), // get this from the jwt token
  role: t.Enum({ owner: "owner", member: "member" }),
  color: t.String(),
});
export type MembershipModelForCreation =
  typeof membershipModelForCreation.static;

export const membershipModel = t.Object({
  id: t.Integer(),
  calendar_id: t.Integer(),
  user_id: t.Integer(),
  role: t.Enum({ owner: "owner", member: "member" }),
  color: t.String(),
});
export type Membership = typeof membershipModel.static;
