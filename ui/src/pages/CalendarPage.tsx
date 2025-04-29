import { CalendarComponent } from "@/components/calendar/CalendarComponent";
import { Button } from "@/components/ui/button";
import { useEventsContext } from "@/contexts/EventsContext";
import { calendarService } from "@/services/calendar";
import {
  Bars3BottomLeftIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Calendar, CalendarVariant } from "@types";
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
import { CalendarOptions } from "@/components/calendar/CalendarOptions";

export const CalendarPage = ({ variant }: { variant: CalendarVariant }) => {
  const { calendar_id } = useParams();
  const {
    contextSetCalendarVariant,
    contextCalendarView,
    contextSetCalendarView,
  } = useEventsContext();

  const mainCalendar = contextCalendarView.mainCalendar[0]?.calendar;

  const calendarsLoaded =
    typeof mainCalendar !== "undefined" &&
    typeof contextCalendarView.personalCalendars !== "undefined" &&
    typeof contextCalendarView.groupMemberCalendars !== "undefined";

  async function getCalendarEvents() {
    if (typeof calendar_id === "undefined") return;

    const result = await calendarService.getCalendar(calendar_id);
    if (!result) return;

    contextSetCalendarView(result);
  }

  async function getEventsAllCalendars() {
    const result = await calendarService.getAllPersonalCalendars();
    if (!result) return;

    contextSetCalendarView(result);
  }

  async function getAllGroupCalendars() {
    if (typeof calendar_id === "undefined") return;

    const result = await calendarService.getGroupCalendar(calendar_id);
    if (!result) return;

    contextSetCalendarView(result);
  }

  useEffect(() => {
    contextSetCalendarVariant(variant);

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
  }, [calendar_id]);

  if (!calendarsLoaded) return <div>loading...</div>;

  const calendarTitle = (calendar: Calendar) => {
    const CalendarIcon =
      variant === "fullPersonal"
        ? CalendarDaysIcon
        : calendar?.is_group
        ? UserGroupIcon
        : UserIcon;
    const calendarName =
      variant === "fullPersonal" ? "Full personal calendar" : calendar?.name;
    const calendarColor =
      variant === "fullPersonal" ? "#000000" : calendar?.color;

    return (
      <>
        <>
          <CalendarIcon
            className="size-6 ml-2"
            style={{ color: calendarColor }}
          />
          <h3 className="font-mono">{calendarName}</h3>
        </>
      </>
    );
  };

  return (
    <Sheet>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-start">
          <div className="flex items-center justify-start my-4 border-black gap-2 h-10">
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
            {calendarTitle(mainCalendar)}
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

        {mainCalendar ? (
          <CalendarOptions calendar_id={mainCalendar.id} />
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
