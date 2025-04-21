import Elysia, { t } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import {
  attendanceDetailsModel,
  AttendanceDTO,
} from "src/models/attendanceModel";
import { tryCatch } from "@shared/src/tryCatch";

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
      app.get(
        "/attendances/:event_id",
        async ({ params, user, error }) => {
          // 1) check if the user has a membership in the calendar
          // const [hasMembership, errMembership] = await tryCatch(
          //   MembershipDTO.hasMembership(params.id, user.id)
          // );
          // if (errMembership) return error(500, errMembership.message);
          // if (!hasMembership)
          //   return error(401, "No authorized access to calendar");

          // 2) get the calendar and events
          const [attendances, err] = await tryCatch(
            AttendanceDTO.getAttendances(params.event_id)
          );
          if (err) return error(500, err.message);
          if (!attendances) return error(500, "Failed to get attendances");

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
  );
