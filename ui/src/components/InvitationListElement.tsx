/**
 * a single calendar list elements shown in the main menu.
 */
import { UserGroupIcon } from "@heroicons/react/24/outline";

import { NewInvitationsResponse } from "@types";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { InvitationCard } from "./InvitationCard";

export const InvitationListElement = ({
  invitation,
}: {
  invitation: NewInvitationsResponse;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-full flex items-center justify-start mb-2 border-dashed border-black"
        >
          <UserGroupIcon className="size-6 ml-4" />
          <h3 className="font-mono">{invitation.name}</h3>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="flex w-80 border-black"
      >
        <InvitationCard invitation={invitation} />
      </PopoverContent>
    </Popover>
  );
};
