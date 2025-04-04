import { Membership, MembershipModelForCreation } from "@shared/index";
import { sql } from "bun";

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
