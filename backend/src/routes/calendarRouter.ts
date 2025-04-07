import Elysia from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import {
  CalendarDTO,
  CalendarModelForCreation,
  calendarModelForUserCreation,
} from "../models/calendarModel";
import {
  MembershipDTO,
  MembershipModelForCreation,
} from "src/models/membershipModel";

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
        async ({ body, user, error }) => {
          // 1) use calendarModel to create a new group calendar for the user
          const calendarForCreation: CalendarModelForCreation = {
            name: body.name,
            description: body.description,
            owner_user_id: user.id,
            is_group: body.is_group,
            color: body.color,
          };
          const calendar = await CalendarDTO.createCalendar(
            calendarForCreation
          );

          // 2) use membershipModel to create a new membership
          const membershipForCreation: MembershipModelForCreation = {
            calendar_id: calendar.id,
            user_id: user.id,
            role: "owner",
            color: body.color,
          };
          const membership = MembershipDTO.createMembership(
            membershipForCreation
          );

          return { calendar_id: calendar.id };
        },
        {
          body: calendarModelForUserCreation,
        }
      )
  );
