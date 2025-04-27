import { AddMember } from "@/components/calendar/AddMember";
import { ChangeColor } from "@/components/calendar/ChangeColor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calendarViewKeys, useEventsContext } from "@/contexts/EventsContext";
import { defaultEvent } from "@/lib/defaultObjects";
import { cn, deepCopy } from "@/lib/utils";
import { membershipService } from "@/services/memberships";
import { ProcessorEvent, processorService } from "@/services/processor";
import {
  PaintBrushIcon,
  SparklesIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { Event, GroupMemberInfo } from "@types";
import { useEffect, useState } from "react";
import { calendarService } from "@/services/calendar";
import { saveAs } from "file-saver";

export const CalendarOptions = ({ calendar_id }: { calendar_id: number }) => {
  const { contextCalendarView, contextSetCalendarView } = useEventsContext();
  const [showNewMemberInput, setShowNewMemberInput] = useState(false);
  const [showChangeColor, setShowChangeColor] = useState(false);
  const [members, setMembers] = useState<GroupMemberInfo[]>([]);

  async function getMembers() {
    if (typeof calendar_id === "undefined") return;

    const membersResult = await membershipService.getMembers(calendar_id);
    if (!membersResult) return;

    setMembers(membersResult);
  }

  async function handleGenerateProposals() {
    const allEventsInView: ProcessorEvent[] = calendarViewKeys.flatMap((key) =>
      contextCalendarView[key].flatMap((calendar) =>
        calendar.events.flatMap((event) => ({
          id: event.id,
          start_time: event.start_time,
          end_time: event.end_time,
          timezone: event.timezone,
          all_day: event.all_day,
        }))
      )
    );

    const proposalsResult = await processorService.generateProposals(
      allEventsInView
    );
    if (!proposalsResult) return;

    // add the proposals to mainCalendar as events
    const newEvents: Event[] = proposalsResult.proposals.map((p) => ({
      ...deepCopy(defaultEvent),
      ...p,
    }));

    contextSetCalendarView((prev) => ({
      ...prev,
      mainCalendar: [
        {
          ...prev.mainCalendar[0],
          events: [...prev.mainCalendar[0].events, ...newEvents],
        },
      ],
    }));
  }

  async function handleExportCalendar() {
    try {
      const response = await calendarService.exportGroupCalendar(calendar_id);
      if (!response) {
        throw new Error("No response received from the server.");
      }
      saveAs(response, `calendar-${calendar_id}.ics`); // Save the file with a meaningful name
    } catch (error) {
      console.error("Failed to export calendar:", error);
    }
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
            {member.role === "owner" ? <Badge>Owner</Badge> : null}
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
          onClick={() => handleGenerateProposals()}
          variant="outline"
          className="flex items-center justify-start border-black"
        >
          <SparklesIcon className="size-6 ml-2" />
          <h3>Generate event proposal</h3>
        </Button>
        <Button
          onClick={() => handleExportCalendar()}
          variant="outline"
          className="flex items-center justify-start border-black"
        >
          <h3>Export group events from this calendar</h3>
      </Button>
      </div>
    </div>
  );
};
