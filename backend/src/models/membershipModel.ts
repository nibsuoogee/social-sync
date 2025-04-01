import { sql } from "bun";
import { t } from "elysia";

/**
 * Calendar Membership Data Transfer Object
 */
export const MembershipDTO = {
  createMembership: async (
    membership: MembershipModelForCreation
  ): Promise<Membership> => {
    const [newMembership] = await sql`
      INSERT INTO calendars ${sql(membership)}
      RETURNING *
    `;
    return newMembership;
  },
};

export const membershipModelForCreation = t.Object({
  calendar_id: t.Integer(),
  user_id: t.Integer(), // get this from the jwt token
  role: t.Enum({ owner: "owner", member: "member" }),
});
export type MembershipModelForCreation =
  typeof membershipModelForCreation.static;

export const membershipModel = t.Object({
  id: t.Integer(),
  calendar_id: t.Integer(),
  user_id: t.Integer(),
  role: t.Enum({ owner: "owner", member: "member" }),
});
export type Membership = typeof membershipModel.static;
