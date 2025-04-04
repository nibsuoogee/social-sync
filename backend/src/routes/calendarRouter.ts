import Elysia from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import { CalendarDTO } from "../models/calendarModel";
import { CalendarModelForCreation } from "@shared/index";

export const calendarRouter = new Elysia()
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
      app.post(
        "/new-calendar",
        async ({
          body,
          user,
          error,
        }: {
          body: any;
          user: any;
          error: unknown;
        }) => {
          // 1) use calendarModel to create a new calendar for the user
          // it can be either personal/group
          const calendarForCreation: CalendarModelForCreation = {
            name: body.name,
            description: body.description,
            owner_user_id: user.id,
            is_group: body.is_group,
          };
          const calendar = CalendarDTO.createCalendar(calendarForCreation);
          // 2) use membershipModel to create a new membership
          //return { username: row.username };
        }
      )
  );
