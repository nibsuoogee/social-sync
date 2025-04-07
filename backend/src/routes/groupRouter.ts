import Elysia, { error } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import {
  InvitationBody,
  InvitationDTO,
  InvitationUpdateBody,
} from "../models/invitationsModel";
import { MembershipDTO } from "../models/membershipModel";
import { JwtObject } from "@shared/src/types";
import { CalendarDTO } from "src/models/calendarModel";

export const groupRouter = new Elysia()
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
        .post(
          "/invite",
          async ({
            body,
            user,
            error,
          }: {
            body: InvitationBody;
            user: JwtObject;
            error: (code: Number, message?: string) => void;
          }) => {
            // user request includes the user_id which the invitation is sent to and calendar_id
            const { createInvitation, findUserIdbyEmail } = InvitationDTO;

            const invitedUserId = await findUserIdbyEmail(body.email);
            // user can't invite themselves
            if (user.id === invitedUserId) return error(400, "Not allowed");

            // check if the current user is the owner of the calendar
            const isCalendarOwner = await CalendarDTO.isCalendarOwner(
              body.calendar_id,
              user.id
            );

            if (!isCalendarOwner)
              return error(401, "No authorized access to calendar");

            const newInvitation = createInvitation({
              calendar_id: body.calendar_id,
              user_id: invitedUserId,
            });

            if (!newInvitation) return error(500, "Internal Server Error");
            return "Success";
          }
        )
        .patch(
          "/update-invitation",
          async ({
            body,
            user,
            error,
          }: {
            body: InvitationUpdateBody;
            user: JwtObject;
            error: any;
          }) => {
            const { updateInvitation } = InvitationDTO;
            const { createMembership } = MembershipDTO;

            const updatedInvitation = await updateInvitation({
              id: body.id,
              user_id: user.id,
              status: body.status,
            });

            if (!updatedInvitation) return error(500, "Internal Server Error");

            // if the invitation is accepted, create a calendar membership for the user
            if (body.status === "accepted") {
              const newInvitation = createMembership({
                calendar_id: updatedInvitation.calendar_id,
                user_id: user.id,
                role: "member",
                color: "#1A1A1A",
              });
              if (!newInvitation) return error(500, "Internal Server Error");
            }

            return "Success";
          }
        )
  );
