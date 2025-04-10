/**
 * List of invites shown in the main menu.
 */

import { NewInvitationsResponse } from "../../types";
import { InvitationListElement } from "./InvitationListElement";

export const InvitationsList = ({
  invitations,
}: {
  invitations: NewInvitationsResponse[];
}) => {
  return (
    <div className="flex-1">
      {invitations.length !== 0
        ? invitations.map((invitation) => (
            <InvitationListElement
              key={invitation.id}
              invitation={invitation}
            />
          ))
        : "No invitations!"}
    </div>
  );
};
