import { AddMember } from "@/components/calendar/AddMember";
import { ChangeColor } from "@/components/calendar/ChangeColor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { membershipService } from "@/services/memberships";
import {
  PaintBrushIcon,
  SparklesIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { GroupMemberInfo } from "@types";
import { useEffect, useState } from "react";

export const CalendarOptions = ({ calendar_id }: { calendar_id: number }) => {
  const [showNewMemberInput, setShowNewMemberInput] = useState(false);
  const [showChangeColor, setShowChangeColor] = useState(false);
  const [members, setMembers] = useState<GroupMemberInfo[]>([]);

  async function getMembers() {
    if (typeof calendar_id === "undefined") return;

    const membersResult = await membershipService.getMembers(calendar_id);
    if (!membersResult) return;

    setMembers(membersResult);
  }

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex flex-col gap-2">
        <h2 className="font-mono text-left mb-2 text-lg">Members</h2>

        {members.map((member) => (
          <Button
            key={member.id}
            variant="outline"
            className="flex items-center justify-start border-black"
          >
            <UserIcon className="size-6 ml-2" style={{ color: member.color }} />
            <h4>
              {member.username} - {member.email}
            </h4>
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-mono text-left mb-2 text-lg">Actions</h2>

        <Button
          onClick={() => setShowNewMemberInput(!showNewMemberInput)}
          variant="outline"
          className={cn("flex items-center justify-start border-black", {
            "bg-zinc-300": showNewMemberInput,
          })}
        >
          <UserPlusIcon className="size-6 ml-2" style={{ color: "#000000" }} />
          <h3>Add a member</h3>
        </Button>

        {showNewMemberInput ? <AddMember calendar_id={calendar_id} /> : null}

        <Button
          onClick={() => setShowChangeColor(!showChangeColor)}
          variant="outline"
          className={cn("flex items-center justify-start border-black", {
            "bg-zinc-300": showChangeColor,
          })}
        >
          <PaintBrushIcon className="size-6 ml-2" />
          <h3>Change your color</h3>
        </Button>

        {showChangeColor ? <ChangeColor calendar_id={calendar_id} /> : null}

        <Button
          onClick={() => console.log("TODO")}
          variant="outline"
          className="flex items-center justify-start border-black"
        >
          <SparklesIcon className="size-6 ml-2" />
          <h3>Generate event proposal</h3>
        </Button>
      </div>
    </div>
  );
};
