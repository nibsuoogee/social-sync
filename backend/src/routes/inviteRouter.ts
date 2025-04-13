import Elysia, { t } from "elysia";
import { jwtConfig } from "../config/jwtConfig";
import { authorizationMiddleware } from "../middleware/authorization";
import {
  invitationBody,
  InvitationDTO,
  InvitationModelForUpdate,
  invitationUpdateBody,
  newInvitationsResponse,
} from "../models/invitationsModel";
import {
  MembershipDTO,
  MembershipModelForCreation,
} from "../models/membershipModel";
import { CalendarDTO } from "src/models/calendarModel";
import { tryCatch } from "@shared/src/tryCatch";

export const inviteRouter = new Elysia()
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
          async ({ body, user, error }) => {
            // 1) find the user id
            const [invitedUserId, errUserId] = await tryCatch(
              InvitationDTO.findUserIdbyEmail(body.email)
            );
            if (errUserId) return error(500, errUserId.message);
            if (!invitedUserId)
              return error(500, "Could not find user by email");

            // 2) check the user isn't inviting themselves
            if (user.id === invitedUserId)
              return error(400, "You cannot invite yourself");

            // 3) check the current user is the owner of the calendar
            const [isCalendarOwner, errOwner] = await tryCatch(
              CalendarDTO.isCalendarOwner(body.calendar_id, user.id)
            );
            if (errOwner) return error(500, errOwner.message);
            if (!isCalendarOwner)
              return error(401, "No authorized access to calendar");

            // 4) create the invitation
            const [newInvitation, errInvitation] = await tryCatch(
              InvitationDTO.createInvitation({
                calendar_id: body.calendar_id,
                user_id: invitedUserId,
              })
            );
            if (errInvitation) return error(500, errInvitation.message);
            if (!newInvitation)
              return error(500, "Could not create new invitation");

            return "Success";
          },
          {
            body: invitationBody,
            response: {
              200: t.String(),
              400: t.String(),
              401: t.String(),
              500: t.String(),
            },
          }
        )
        .get(
          "/new-invites",
          async ({ user, error }) => {
            // 1) get the user's invites with the status "needs-action"
            const [invitations, err] = await tryCatch(
              InvitationDTO.getNewInvitations(user.id)
            );
            if (err) return error(500, err.message);
            if (!invitations) return error(500, "Failed to get invitations");

            return invitations;
          },
          {
            response: {
              200: t.Array(newInvitationsResponse),
              500: t.String(),
            },
          }
        )
        .patch(
          "/invite",
          async ({ body, user, error }) => {
            // 1) Update the invitation
            const invitationUpdate: InvitationModelForUpdate = {
              id: body.id,
              user_id: user.id,
              status: body.status,
            };
            const [updatedInvitation, errUpdate] = await tryCatch(
              InvitationDTO.updateInvitation(invitationUpdate)
            );
            if (errUpdate) return error(500, errUpdate.message);
            if (!updatedInvitation) return error(500, "Internal Server Error");

            // 2) if the invitation is accepted, create a calendar
            //    membership for the user
            if (body.status !== "accepted") {
              return "Success";
            }

            const membership: MembershipModelForCreation = {
              calendar_id: updatedInvitation.calendar_id,
              user_id: user.id,
              role: "member",
              color: "#1A1A1A",
            };
            const [newMembership, errMembership] = await tryCatch(
              MembershipDTO.createMembership(membership)
            );
            if (errMembership) return error(500, errMembership.message);
            if (!newMembership) return error(500, "Internal Server Error");

            return "Success";
          },
          {
            body: invitationUpdateBody,
            response: {
              200: t.String(),
              500: t.String(),
            },
          }
        )
  );
