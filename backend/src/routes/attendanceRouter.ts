import Elysia, { t } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import {
  attendanceDetailsModel,
  AttendanceDTO,
  attendanceUpdateBody,
} from "src/models/attendanceModel";
import { tryCatch } from "@shared/src/tryCatch";
import { MembershipDTO } from "src/models/membershipModel";

export const attendanceRouter = new Elysia()
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
          "/attendances/:event_id",
          async ({ params, user, error }) => {
            // 1) get the calendar and events
            const [attendances, err] = await tryCatch(
              AttendanceDTO.getAttendances(params.event_id)
            );
            if (err) return error(500, err.message);
            if (!attendances) return error(500, "Failed to get attendances");

            // 2) check the user belongs to the attendances and is
            //    therefore authorized to view them
            const indexOfUser = attendances.findIndex(
              (a) => a.user_id === user.id
            );
            if (indexOfUser === -1)
              return error(401, "No authorized access to attendances");

            return attendances;
          },
          {
            params: t.Object({ event_id: t.Integer() }),
            response: {
              200: t.Array(attendanceDetailsModel),
              401: t.String(),
              500: t.String(),
            },
          }
        )
        .patch(
          "/attendance",
          async ({ body, user, error }) => {
            // 1) Check the user owns the membership row
            const [hasMembership, errMembership] = await tryCatch(
              MembershipDTO.userOwnsThisMembership(body.membership_id, user.id)
            );
            if (errMembership) return error(500, errMembership.message);
            if (!hasMembership)
              return error(401, "No authorized access to membership");

            // 2) Update the attendance
            const [updatedInvitation, errUpdate] = await tryCatch(
              AttendanceDTO.updateAttendance(body)
            );
            if (errUpdate) return error(500, errUpdate.message);
            if (!updatedInvitation) return error(500, "Internal Server Error");

            return "Success";
          },
          {
            body: attendanceUpdateBody,
            response: {
              200: t.String(),
              401: t.String(),
              500: t.String(),
            },
          }
        )
  );
