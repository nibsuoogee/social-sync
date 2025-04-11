import { CalendarList } from "@/components/CalendarList";
import { useEffect, useState } from "react";
import { Calendar, NewInvitationsResponse } from "@types";
//import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { InvitationsList } from "@/components/InvitationsList";
import { Button } from "@/components/ui/button";
import { useCalendarService } from "@/services/calendar";
import { useInvitationService } from "@/services/invitation";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { CreateCalendarCard } from "@/components/CreateCalendarCard";

export const MainMenu = () => {
  const { getCalendars } = useCalendarService();
  const { getInvitations } = useInvitationService();

  const [personalCalendars, setPersonalCalendars] = useState<Calendar[]>([]);
  const [groupCalendars, setGroupCalendars] = useState<Calendar[]>([]);
  const [invitations, setInvitations] = useState<NewInvitationsResponse[]>([]);
  const [side, setSide] = useState<"right" | "bottom">("right");

  // for knowing which side to render the calendar info card
  useEffect(() => {
    const handleResize = () => {
      setSide(window.innerWidth < 768 ? "bottom" : "right");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDeleteCalendar = (id: number) => {
    setPersonalCalendars((prev) => prev.filter((cal) => cal.id !== id));
    setGroupCalendars((prev) => prev.filter((cal) => cal.id !== id));
  };

  const getCalendarsRequest = async () => {
    const calendars = await getCalendars();
    if (!calendars) return;

    setPersonalCalendars(calendars.filter((calendar) => !calendar.is_group));
    setGroupCalendars(calendars.filter((calendar) => calendar.is_group));
  };

  const getInvitationsRequest = async () => {
    const invitations = await getInvitations();
    if (!invitations) return;

    setInvitations(invitations);
  };

  useEffect(() => {
    getCalendarsRequest();
    getInvitationsRequest();
  }, []);

  return (
    <Popover>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col md:w-1/2">
          <div className="flex flex-col">
            <h2 className="font-mono text-left mb-2 text-lg">
              Personal Calendars
            </h2>
            <CalendarList
              calendars={personalCalendars}
              onDelete={handleDeleteCalendar}
            ></CalendarList>
            <div className="flex flex-col mt-2 sm:flex-row gap-2">
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className=" flex-1 border-double border-4  border-gray-500
              hover:border-gray-800"
                >
                  <PlusIcon className="flex items-center justify-start" />
                  Create
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side={side}
                align="start"
                className="flex w-80 border-black"
              >
                <CreateCalendarCard />
              </PopoverContent>
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

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col md:w-1/2">
            <h2 className="font-mono text-left mb-2 text-lg">
              Group Calendars
            </h2>
            <CalendarList
              calendars={groupCalendars}
              onDelete={handleDeleteCalendar}
            ></CalendarList>
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
            <h2 className="font-mono text-left mb-2 text-lg">
              Group calendar Invitations
            </h2>
            <InvitationsList invitations={invitations}></InvitationsList>
          </div>
        </div>
      </div>
    </Popover>
  );
};
