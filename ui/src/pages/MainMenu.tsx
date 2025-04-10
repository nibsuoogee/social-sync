import { CalendarList } from "@/components/CalendarList";
import { useEffect, useState } from "react";
import { Calendar, NewInvitationsResponse } from "../../types";
//import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { InvitationsList } from "@/components/InvitationsList";
import { Button } from "@/components/ui/button";
import { useCalendarService } from "@/services/calendar";
import { useInvitationService } from "@/services/invitation";

export const MainMenu = () => {
  const { fetchCalendars } = useCalendarService();
  const { fetchInvitations } = useInvitationService();

  const [personalCalendars, setPersonalCalendars] = useState<Calendar[]>([]);
  const [groupCalendars, setGroupCalendars] = useState<Calendar[]>([]);
  const [invitations, setInvitations] = useState<NewInvitationsResponse[]>([]);

  const getCalendars = async () => {
    const calendars = await fetchCalendars();
    if (!calendars) return;

    setPersonalCalendars(calendars.filter((calendar) => !calendar.is_group));
    setGroupCalendars(calendars.filter((calendar) => calendar.is_group));
  };

  const getInvitations = async () => {
    const invitations = await fetchInvitations();
    if (!invitations) return;

    setInvitations(invitations);
  };

  useEffect(() => {
    getCalendars();
    getInvitations();
  }, []);

  return (
    <div>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col w-128 flex-initial">
          <div className="p-6 flex flex-col">
            <h2 className="font-mono text-left mb-2">Personal Calendars</h2>
            <CalendarList calendars={personalCalendars}></CalendarList>
            <Button variant={"outline"}>
              <PlusIcon className="flex items-center justify-start" />
              Create
            </Button>
            <Button variant={"outline"} className="mt-2">
              <ArrowDownIcon className="flex items-center justify-start" />
              Import
            </Button>
          </div>
          <div className="p-4 flex flex-col">
            <h2 className="font-mono text-left mb-2">Group Calendars</h2>
            <CalendarList calendars={groupCalendars}></CalendarList>
            <Button variant={"outline"}>
              <PlusIcon className="flex items-center justify-start" />
              Create
            </Button>
          </div>
        </div>

        <div className="flex flex-col w-128 flex-initial">
          <h2 className="font-mono text-left mb-2">
            Group calendar Invitations
          </h2>
          <InvitationsList invitations={invitations}></InvitationsList>
        </div>
      </div>
    </div>
  );
};
