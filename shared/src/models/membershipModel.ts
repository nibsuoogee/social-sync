import { t } from "elysia";

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
