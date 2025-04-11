import { CalendarList } from "@/components/CalendarList";
import axios from "axios";
import { useEffect, useState } from "react";
import { Calendar, NewInvitationsResponse } from "../../types";
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
        console.error("Error fetching invitations:", error);
      }
    };

    fetchCalendars();
    fetchInvitations();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col md:w-1/2">
        <div className="flex flex-col">
          <h2 className="font-mono text-left mb-2">Personal Calendars</h2>
          <CalendarList calendars={personalCalendars}></CalendarList>
          <div className="flex flex-col mt-2 sm:flex-row gap-2">
            <Button
              variant={"outline"}
              className=" flex-1 border-double border-4  border-gray-500
              hover:border-gray-800"
            >
              <PlusIcon className="flex items-center justify-start" />
              Create
            </Button>
            <Button
              variant={"outline"}
              className="flex-1 border-double border-4 border-gray-500
              hover:border-gray-800"
            >
              <ArrowDownIcon className="flex items-center justify-start" />
              Import
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <div className="flex flex-col md:w-1/2">
          <h2 className="font-mono text-left mb-2">Group Calendars</h2>
          <CalendarList calendars={groupCalendars}></CalendarList>
          <Button
            variant={"outline"}
            className="border-double border-4  border-gray-500
              hover:border-gray-800 mt-2"
          >
            <PlusIcon className="flex items-center justify-start" />
            Create
          </Button>
        </div>
        <div className="md:w-1/2">
          <h2 className="font-mono text-left mb-2">
            Group calendar Invitations
          </h2>
          <InvitationsList invitations={invitations}></InvitationsList>
        </div>
      </div>
    </div>
  );
};
