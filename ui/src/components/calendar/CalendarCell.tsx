import { JSX, RefObject, useEffect, useRef, useState } from "react";
import { DayProps, useDayRender } from "react-day-picker";
import { calendarViewKeys, useEventsContext } from "@/contexts/EventsContext";
import { EventBlock } from "@/components/calendar/EventBlock";
import { isSameDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { deepCopy } from "@/lib/utils";
import {
  defaultCalendarView,
  defaultEventModelBody,
} from "@/lib/defaultObjects";
import { eventService } from "@/services/event";
import { CalendarAndEvents } from "@/services/calendar";
import { CalendarViewKey, EventEditPermission } from "@types";

const MAX_VISIBLE_EVENTS = 3;

/**
 * Fills a calendar's cell, and provides features such opening a window to
 * create an event when the user clicks inside it.
 */
export const CalendarCell = (props: DayProps) => {
  const {
    contextCalendarVariant,
    contextCalendarView,
    contextSetCalendarView,
  } = useEventsContext();
  const [firstVisibleEvent, setFirstVisibleEvent] = useState<
    number | undefined
  >();
  const dayCalendars = deepCopy(defaultCalendarView);
  const noEventsInCell = typeof firstVisibleEvent === "undefined";
  const buttonRef = useRef<HTMLButtonElement>(
    null
  ) as RefObject<HTMLButtonElement>;

  const { isHidden, isButton, /*buttonProps,*/ divProps } = useDayRender(
    props.date,
    props.displayMonth,
    buttonRef
  );

  const filterCalendarToday = (calendarAndEvents: CalendarAndEvents[]) =>
    calendarAndEvents.map((cal) => {
      const filteredEvents = cal.events.filter((e) => {
        const eventDate = new Date(e.start_time); // ISO string -> Date object

        if (isSameDate(eventDate, props.date)) return true;

        return false;
      });

      return { calendar: cal.calendar, events: filteredEvents };
    });

  // day content
  const calendarViewPermissions: Record<CalendarViewKey, EventEditPermission> =
    {
      mainCalendar: "default",
      personalCalendars: "navigate",
      groupMemberCalendars: "restrict",
    };

  calendarViewKeys.forEach((view) => {
    dayCalendars[view] = filterCalendarToday(contextCalendarView[view]);
  });

  // Add all events from all calendars as eventblocks to array
  // and then take a slice
  const allEventBlocksFiltered = calendarViewKeys.flatMap((view) =>
    dayCalendars[view].flatMap((filtered, calendarIndex) => {
      const { calendar, events } = filtered;

      const sortedEvents = events.sort(function (a, b) {
        if (a.all_day && !b.all_day) return -1;
        if (!a.all_day && b.all_day) return 1;

        return (
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
      });

      return sortedEvents.map((event) => {
        return (
          <div key={`${view}-${calendarIndex}-${event.id}`}>
            <EventBlock
              event={event}
              calendar={calendar}
              bgColor={calendar.color}
              customClass="min-h-6 max-h-10 h-min"
              borderStyle={
                event.status === "tentative"
                  ? "dashed"
                  : calendar.is_group
                  ? "solid"
                  : ""
              }
              editPermission={
                contextCalendarVariant === "group" &&
                view === "personalCalendars"
                  ? "navigateFullPersonal"
                  : contextCalendarVariant === "single" && event.user_read_only
                  ? "restrict"
                  : calendarViewPermissions[view]
              }
            />
          </div>
        );
      });
    })
  );

  useEffect(() => {
    setFirstVisibleEvent(allEventBlocksFiltered.length > 0 ? 0 : undefined);
  }, [allEventBlocksFiltered.length]);

  // Don't render if hidden (e.g., days from other months and showOutsideDays is false)
  if (isHidden) return <div {...divProps} />;

  let visibleEvents: JSX.Element[] = [];

  if (!noEventsInCell) {
    visibleEvents = allEventBlocksFiltered.slice(
      firstVisibleEvent,
      firstVisibleEvent + MAX_VISIBLE_EVENTS
    );
  }

  function nextPage() {
    setFirstVisibleEvent((prev) => {
      if (typeof prev === "undefined") return undefined;
      return prev + MAX_VISIBLE_EVENTS;
    });
  }

  function previousPage() {
    setFirstVisibleEvent((prev) => {
      if (typeof prev === "undefined") return undefined;
      return prev - MAX_VISIBLE_EVENTS;
    });
  }

  const disableNextPage = () => {
    if (noEventsInCell) return true;

    return (
      firstVisibleEvent + MAX_VISIBLE_EVENTS > allEventBlocksFiltered.length
    );
  };

  const disablePreviousPage = () => {
    if (noEventsInCell) return true;

    return firstVisibleEvent - MAX_VISIBLE_EVENTS < 0;
  };

  const showingMaxEvents = visibleEvents.length === MAX_VISIBLE_EVENTS;

  const externalSourceUrl =
    contextCalendarView?.mainCalendar[0]?.calendar.external_source_url;
  const calendarIsImported =
    typeof externalSourceUrl === "string" && externalSourceUrl.length > 0;

  const canAddEvent =
    contextCalendarVariant !== "fullPersonal" && !calendarIsImported
      ? noEventsInCell
        ? true
        : showingMaxEvents
        ? false
        : true
      : false;

  async function addNewEvent(date: Date) {
    const thisCalendarId = contextCalendarView.mainCalendar[0]?.calendar.id;
    if (typeof thisCalendarId !== "number") return;

    // 1) create a new empty event
    const now = new Date();
    const newEventBody = deepCopy(defaultEventModelBody);

    newEventBody.calendar_id = thisCalendarId;
    newEventBody.start_time = new Date(
      date.setHours(now.getHours(), now.getMinutes())
    );
    newEventBody.end_time = new Date(
      date.setHours(now.getHours(), now.getMinutes() + 30)
    );
    // 2) send it to the server and wait for the full event
    const response = await eventService.postEvent(newEventBody);
    if (!response) return;

    // 3) add the full event to the mainCalendar
    contextSetCalendarView((prev) => ({
      ...prev,
      mainCalendar: [
        {
          ...prev.mainCalendar[0],
          events: [...prev.mainCalendar[0].events, response.event],
        },
      ],
    }));
  }

  // If it's a button day (clickable/selectable)
  if (isButton) {
    const isToday = isSameDate(new Date(), props.date);
    const dateText = () => (
      <h4 style={{ fontWeight: isToday ? "bold" : "normal" }}>
        {props.date.getDate()}
      </h4>
    );

    return (
      <div className="flex flex-col text-xs w-full h-full border-solid border-1 border-gray-200">
        {/* <button
          ref={buttonRef}
          {...buttonProps}
          className="h-10 w-10 rounded hover:bg-accent text-sm"
        ></button> */}
        {!noEventsInCell &&
        allEventBlocksFiltered.length >= MAX_VISIBLE_EVENTS ? (
          <div className="flex items-center justify-between">
            <Button
              onClick={previousPage}
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              disabled={disablePreviousPage()}
            >
              <ChevronLeftIcon />
            </Button>
            {dateText()}
            <Button
              onClick={nextPage}
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              disabled={disableNextPage()}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        ) : (
          <>{dateText()}</>
        )}

        {visibleEvents}

        {canAddEvent ? (
          <Button
            onClick={() => addNewEvent(props.date)}
            style={{
              backgroundColor: "transparent",
              borderColor:
                contextCalendarView.mainCalendar[0]?.calendar?.color ??
                "#cccccc",
            }}
            className="h-8 border border-dashed border-3 opacity-0 hover:opacity-100 w-full"
          />
        ) : null}
      </div>
    );
  }

  // Non-interactive day (e.g. disabled)
  return (
    <div {...divProps} className="h-10 w-10 text-muted-foreground text-sm">
      {props.date.getDate()}
    </div>
  );
};
