import Elysia, { t } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import {
  groupMemberInfo,
  MembershipDTO,
  membershipModel,
} from "../models/membershipModel";
import { tryCatch } from "@shared/src/tryCatch";

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
        .delete(
          "/memberships/:calendar_id",
          async ({ params, user, error }) => {
            const [deletedMembership, errDelete] = await tryCatch(
              MembershipDTO.deleteMembership(params.calendar_id, user.id)
            );

            if (errDelete) return error(500, errDelete.message);

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
