import Elysia, { t } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import {
  groupMemberInfo,
  membershipColorUpdateBody,
  MembershipDTO,
  membershipModel,
} from "../models/membershipModel";
import { tryCatch } from "@utils/tryCatch";

export const membershipsRouter = new Elysia()
  .use(jwtConfig)
  .derive(authorizationMiddleware)
  .guard(
    {
      beforeHandle: ({ user, error }) => {
        // 1. Check if the user is authenticated
        //    If not, return a 401 error
        if (!user) return error(401, "Not Authorized");
      },
    },
    (app) =>
      app
        .get(
          "/memberships/:calendar_id",
          async ({ params, user, error }) => {
            // 1) check if the user has a membership in the calendar
            const [hasMembership, errMembership] = await tryCatch(
              MembershipDTO.hasMembership(params.calendar_id, user.id)
            );
            if (errMembership) return error(500, errMembership.message);
            if (!hasMembership)
              return error(401, "No authorized access to calendar");

            // 2) get the members of the calendar
            const [memberships, err] = await tryCatch(
              MembershipDTO.getMembers(params.calendar_id)
            );
            if (err) return error(500, err.message);
            if (!memberships) return error(500, "Failed to get memberships");

            return memberships;
          },
          {
            params: t.Object({ calendar_id: t.Integer() }),
            response: {
              200: t.Array(groupMemberInfo),
              401: t.String(),
              500: t.String(),
            },
          }
        )
        .patch(
          "/membership/color",
          async ({ body, user, error }) => {
            // 1) check if the user owns the membership
            const [hasMembership, errOwner] = await tryCatch(
              MembershipDTO.hasMembership(body.calendar_id, user.id)
            );
            if (errOwner) return error(500, errOwner.message);
            if (!hasMembership)
              return error(401, "No authorized access to membership");

            // 2) Update the membership
            const { calendar_id, color } = body;

            const [membership, errMembership] = await tryCatch(
              MembershipDTO.updateColor(calendar_id, user.id, color)
            );
            if (errMembership) return error(500, errMembership.message);
            if (!membership) return error(500, "Failed to update membership");

            return membership;
          },
          {
            body: membershipColorUpdateBody,
            response: {
              200: membershipModel,
              401: t.String(),
              500: t.String(),
            },
          }
        )
        .delete(
          "/memberships/:calendar_id",
          async ({ params, user, error }) => {
            // 1) delete the membership
            const [deletedMembership, errDelete] = await tryCatch(
              MembershipDTO.deleteMembership(params.calendar_id, user.id)
            );
            if (errDelete) return error(500, errDelete.message);
            if (!deletedMembership)
              return error(500, "Failed to delete membership");

            // 2) if the user was the owner, randomly select a new owner
            if (deletedMembership.role === "member") return "Success";

            const [newOwner, errNewOwner] = await tryCatch(
              MembershipDTO.setNewOwner(params.calendar_id)
            );
            if (errNewOwner) return error(500, errNewOwner.message);
            if (!newOwner) return error(500, "Failed to set new owner");

            return "Success";
          },
          {
            params: t.Object({ calendar_id: t.Integer() }),
            response: {
              200: t.String(),
              400: t.String(),
              401: t.String(),
              500: t.String(),
            },
          }
        )
  );
