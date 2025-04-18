import { CalendarComponent } from "@/components/calendar/CalendarComponent";
import { Button } from "@/components/ui/button";
import { useEventsContext } from "@/contexts/EventsContext";
import { calendarService } from "@/services/calendar";
import {
  Bars3BottomLeftIcon,
  CalendarDaysIcon,
  SparklesIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Calendar } from "@types";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MembersList } from "@/components/calendar/MembersList";

export const CalendarPage = ({
  variant,
}: {
  variant: "single" | "fullPersonal" | "group";
}) => {
  const { calendar_id } = useParams();
  const { contextCalendarsAndEvents, contextHandleCalendarsAndEvents } =
    useEventsContext();

  const firstCalendar = contextCalendarsAndEvents[0]?.calendar;

  async function getCalendarEvents() {
    if (typeof calendar_id === "undefined") return;

    const result = await calendarService.getCalendar(calendar_id);
    if (!result) return;

    contextHandleCalendarsAndEvents([result]);
  }

  async function getEventsAllCalendars() {
    const result = await calendarService.getAllPersonalCalendars();
    if (!result) return;

    contextHandleCalendarsAndEvents(result);
  }

  async function getAllGroupCalendars() {
    if (typeof calendar_id === "undefined") return;

    const result = await calendarService.getMemberCalendars(calendar_id);
    if (!result) return;

    contextHandleCalendarsAndEvents(result);
  }

  useEffect(() => {
    switch (variant) {
      case "fullPersonal":
        getEventsAllCalendars();
        break;
      case "group":
        getAllGroupCalendars();
        break;
      case "single":
        getCalendarEvents();
        break;
    }
  }, []);

  if (!firstCalendar) return <div>loading...</div>;

  const calendarTitle = (calendar: Calendar) => {
    const CalendarIcon =
      variant === "fullPersonal"
        ? CalendarDaysIcon
        : !calendar.is_group
        ? UserIcon
        : UserGroupIcon;
    const calendarName =
      variant === "fullPersonal" ? "Full personal calendar" : calendar.name;
    const calendarColor =
      variant === "fullPersonal" ? "#000000" : calendar.color;

    return (
      <>
        <CalendarIcon
          className="size-6 ml-2"
          style={{ color: calendarColor }}
        />
        <h3 className="font-mono">{calendarName}</h3>
      </>
    );
  };

  return (
    <Sheet>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-start">
          <div className="flex items-center justify-start my-4 border-black gap-2">
            {variant === "group" ? (
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-500 hover:border-gray-800"
                >
                  <Bars3BottomLeftIcon className="w-6 mr-2" />
                  Options
                </Button>
              </SheetTrigger>
            ) : null}

            {calendarTitle(firstCalendar)}
          </div>
          <CalendarComponent />
        </div>
      </div>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Options</SheetTitle>
          <SheetDescription>
            Calendar management options are found here
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-8 py-4">
          <div>
            <h2 className="font-mono text-left mb-2 text-lg">Members</h2>
            <MembersList calendar_id={firstCalendar.id} />
          </div>

          <div>
            <h2 className="font-mono text-left mb-2 text-lg">Actions</h2>
            <Button
              onClick={() => null}
              variant="outline"
              className="flex items-center justify-start border-black w-full"
            >
              <SparklesIcon className="w-6" />
              <h3>Generate event proposal</h3>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
