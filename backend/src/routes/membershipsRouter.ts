import Elysia, { t } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import { MembershipDTO } from "../models/membershipModel";
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
      app.delete(
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
