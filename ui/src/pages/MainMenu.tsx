import { CalendarList } from "@/components/CalendarList";
import { useEffect, useState } from "react";
import { Calendar, NewInvitationsResponse } from "@types";
import {
  PlusIcon,
  ArrowDownIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { InvitationsList } from "@/components/InvitationsList";
import { Button } from "@/components/ui/button";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { CreateCalendarCard } from "@/components/CreateCalendarCard";
import { calendarService } from "@/services/calendar";
import { invitationService } from "@/services/invitation";
import { CalendarListContext } from "@/contexts/CalendarListContext";
import { InvitationListContext } from "@/contexts/InvitationListContext";
import { useNavigate } from "react-router-dom";
import { ImportCalendarForm } from "@/components/ImportCalendarForm";

export const MainMenu = () => {
  const navigate = useNavigate();

  const [personalCalendars, setPersonalCalendars] = useState<Calendar[]>([]);
  const [groupCalendars, setGroupCalendars] = useState<Calendar[]>([]);
  const [invitations, setInvitations] = useState<NewInvitationsResponse[]>([]);

  const handleDeleteCalendar = (id: number) => {
    setPersonalCalendars((prev) => prev.filter((cal) => cal.id !== id));
    setGroupCalendars((prev) => prev.filter((cal) => cal.id !== id));
  };

  const handleDeleteInvitation = (id: number) => {
    setInvitations((prev) => prev.filter((inv) => inv.id !== id));
  };

  const getCalendarsRequest = async () => {
    const calendars = await calendarService.getCalendars();
    if (!calendars) return;

    setPersonalCalendars(calendars.filter((calendar) => !calendar.is_group));
    setGroupCalendars(calendars.filter((calendar) => calendar.is_group));
  };

  const getInvitationsRequest = async () => {
    const invitations = await invitationService.getInvitations();
    if (!invitations) return;

    setInvitations(invitations);
  };

  const handleAddCalendar = (calendar: Calendar) => {
    if (calendar.is_group) {
      setGroupCalendars((prev) => prev.concat([calendar]));
      return;
    }
    setPersonalCalendars((prev) => prev.concat([calendar]));
  };

  const navigateAllCalendars = () => {
    navigate("/calendar/all");
  };

  useEffect(() => {
    getCalendarsRequest();
    getInvitationsRequest();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col md:w-1/2">
        <div className="flex flex-col">
          <h2 className="font-mono text-left mb-2 text-lg">
            Personal Calendars
          </h2>
          <Button
            onClick={navigateAllCalendars}
            variant={"outline"}
            className="w-full flex items-center justify-start mb-2 border-black"
          >
            <CalendarDaysIcon
              className="size-6 ml-2"
              style={{ color: "#000000" }}
            />

            <h3 className="font-mono">Show full personal calendar</h3>
          </Button>
          <CalendarListContext.Provider
            value={{
              contextCalendars: personalCalendars,
              contextDeleteCalendar: handleDeleteCalendar,
              contextAddCalendar: handleAddCalendar,
            }}
          >
            <CalendarList />
          </CalendarListContext.Provider>
          <div className="flex flex-col mt-2 sm:flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className=" flex-1 border-double border-4 border-gray-500
              hover:border-gray-800"
                >
                  <PlusIcon className="flex items-center justify-start" />
                  Create
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="right"
                align="end"
                flipXonMdScreenWidth
                className="flex w-80 border-black"
              >
                <CreateCalendarCard
                  isGroup={false}
                  addCalendar={handleAddCalendar}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="flex-1 border-double border-4 border-gray-500
                hover:border-gray-800"
                >
                  <ArrowDownIcon className="flex items-center justify-start" />
                  Import
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="right"
                align="end"
                flipXonMdScreenWidth
                className="z-50 w-[400px] max-h-[600px] overflow-auto border-black"
              >
                <ImportCalendarForm addCalendar={handleAddCalendar} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col md:w-1/2">
          <h2 className="font-mono text-left mb-2 text-lg">Group Calendars</h2>
          <CalendarListContext.Provider
            value={{
              contextCalendars: groupCalendars,
              contextDeleteCalendar: handleDeleteCalendar,
              contextAddCalendar: handleAddCalendar,
            }}
          >
            <CalendarList />
          </CalendarListContext.Provider>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="border-double border-4  border-gray-500
              hover:border-gray-800 mt-2"
              >
                <PlusIcon className="flex items-center justify-start" />
                Create
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              className="flex w-80 border-black"
            >
              <CreateCalendarCard
                isGroup={true}
                addCalendar={handleAddCalendar}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="md:w-1/2">
          <h2 className="font-mono text-left mb-2 text-lg">
            Group calendar Invitations
          </h2>
          <InvitationListContext.Provider
            value={{
              contextInvitations: invitations,
              contextDeleteInvitation: handleDeleteInvitation,
              contextAddCalendar: handleAddCalendar,
            }}
          >
            <InvitationsList />
          </InvitationListContext.Provider>
        </div>
      </div>
    </div>
  );
};
