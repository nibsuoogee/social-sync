/**
 * List of invites shown in the main menu.
 */
import { useInvitationListContext } from "@/contexts/InvitationListContext";
import { InvitationListElement } from "./InvitationListElement";

export const InvitationsList = () => {
  const { contextInvitations } = useInvitationListContext();
  return (
    <div className="flex-1">
      {contextInvitations.length !== 0
        ? contextInvitations.map((invitation) => (
            <InvitationListElement
              key={invitation.id}
              invitation={invitation}
            />
          ))
        : "No invitations!"}
    </div>
  );
};
