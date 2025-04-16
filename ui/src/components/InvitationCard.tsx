import { NewInvitationsResponse } from "types";
import { Button } from "./ui/button";
import { UserIcon } from "@heroicons/react/24/outline";
import { useInvitationListContext } from "@/contexts/InvitationListContext";
import { invitationService } from "@/services/invitation";

/**
 * This is shown when a user clicks on a calendar on an invitation.
 * The card shows calendar invite info and buttons to accept or decline.
 */
export const InvitationCard = ({
  invitation,
}: {
  invitation: NewInvitationsResponse;
}) => {
  const { contextDeleteInvitation, contextAddCalendar } =
    useInvitationListContext();

  const handleInvitation = async (status: "accepted" | "declined") => {
    const result = await invitationService.patchInvitation({
      id: invitation.id,
      status: status,
    });

    if (!result) return;

    contextDeleteInvitation(invitation.id);

    if (typeof result === "string") return;
    if (status === "accepted") {
      contextAddCalendar(result);
    }
  };

  return (
    <div className="flex flex-col gap-2 border-black">
      <h2 className="font-mono font-bold text-left mb-2">{invitation.name}</h2>
      <h2 className="font-mono text-sm text-left mb-2">
        {invitation.description}
      </h2>
      <h2 className="font-mono italic text-left mb-2">Members:</h2>
      {invitation.members.map((member) => (
        <div key={member.email} className="flex gap-1 items-center">
          <UserIcon className="h-6 w-6" />
          <h2 className="font-mono text-sm text-left mb-2">
            {member.username} - {member.email}
          </h2>
        </div>
      ))}
      <div className="flex justify-end gap-2">
        <Button
          onClick={() => handleInvitation("declined")}
          variant={"outline"}
          className="border-black w-20"
        >
          Decline
        </Button>

        <Button
          onClick={() => handleInvitation("accepted")}
          variant={"outline"}
          className="border-black w-20"
        >
          Accept
        </Button>
      </div>
    </div>
  );
};
