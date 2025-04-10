import { CalendarList } from "@/components/CalendarList";
import axios from "axios";
import { useEffect, useState } from "react";
import { Calendar, NewInvitationsResponse } from "../../types";
//import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { InvitationsList } from "@/components/InvitationsList";
import { Button } from "@/components/ui/button";

export const MainMenu = () => {
  const [personalCalendars, setPersonalCalendars] = useState<Calendar[]>([]);
  const [groupCalendars, setGroupCalendars] = useState<Calendar[]>([]);
  const [invitations, setInvitations] = useState<NewInvitationsResponse[]>([]);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await axios.get<Calendar[]>(
          "https://backend.localhost/calendars"
        );
        setPersonalCalendars(
          response.data.filter((calendar) => !calendar.is_group)
        );
        setGroupCalendars(
          response.data.filter((calendar) => calendar.is_group)
        );
      } catch (error) {
        console.error("Error fetching calendars:", error);
      }
    };

    const fetchInvitations = async () => {
      try {
        const response = await axios.get<NewInvitationsResponse[]>(
          "https://backend.localhost/new-invites"
        );
        setInvitations(response.data);
      } catch (error) {
        console.error("Error fetching calendars:", error);
      }
    };

    fetchCalendars();
    fetchInvitations();
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
