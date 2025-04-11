/**
 * a single calendar list elements shown in the main menu.
 */
import { UserGroupIcon } from "@heroicons/react/24/outline";

import { NewInvitationsResponse } from "../../types";
import { Button } from "./ui/button";

export const InvitationListElement = ({
  invitation,
}: {
  invitation: NewInvitationsResponse;
}) => {
  return (
    <Button
      variant={"outline"}
      className="w-full flex items-center justify-start mb-2 border-dashed border-black"
    >
      <UserGroupIcon className="size-6 ml-4" />

      <h3 className="font-mono">{invitation.name}</h3>
    </Button>
  );
};
