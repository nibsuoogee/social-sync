import { JSX, RefObject, useEffect, useRef, useState } from "react";
import { DayProps, useDayRender } from "react-day-picker";
import { useEventsContext } from "@/contexts/EventsContext";
import { EventBlock } from "@/components/calendar/EventBlock";
import { isSameDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { deepCopy } from "@/lib/utils";
import { defaultEventModelBody } from "@/lib/defaultObjects";
import { eventService } from "@/services/event";

const MAX_VISIBLE_EVENTS = 3;

/**
 * Fills a calendar's cell, and provides features such opening a window to
 * create an event when the user clicks inside it.
 */
export const CalendarCell = (props: DayProps) => {
  const { contextCalendarsAndEvents, contextSetCalendarsAndEvents } =
    useEventsContext();
  const [firstVisibleEvent, setFirstVisibleEvent] = useState<
    number | undefined
  >();
  const noEventsInCell = typeof firstVisibleEvent === "undefined";
  const buttonRef = useRef<HTMLButtonElement>(
    null
  ) as RefObject<HTMLButtonElement>;
  const isSingleCalendar = contextCalendarsAndEvents.length === 1;

  const { isHidden, isButton, /*buttonProps,*/ divProps } = useDayRender(
    props.date,
    props.displayMonth,
    buttonRef
  );

  // day content
  const calendarsAndEventsFiltered = contextCalendarsAndEvents.map((cal) => {
    const filteredEvents = cal.events.filter((e) => {
      const eventDate = new Date(e.start_time); // ISO string -> Date object

      if (isSameDate(eventDate, props.date)) return true;

      return false;
    });

    return { calendar: cal.calendar, events: filteredEvents };
  });

  // Add all events from all calendars as eventblocks to array
  // and then take a slice
  const allEventBlocksFiltered = calendarsAndEventsFiltered.flatMap(
    (filtered, index) => {
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
          <div key={`${index}-${event.id}`}>
            <EventBlock
              event={event}
              calendarId={calendar.id}
              bgColor={calendar.color}
              customClass="min-h-6 max-h-10 h-min"
              borderStyle={calendar.is_group ? "solid" : ""}
            />
          </div>
        );
      });
    }
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

  const canAddEvent = isSingleCalendar
    ? noEventsInCell
      ? true
      : showingMaxEvents
      ? false
      : true
    : false;

  async function addNewEvent(date: Date) {
    const thisCalendarId = contextCalendarsAndEvents[0]?.calendar.id;
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

    // 3) add the full event to the context
    contextSetCalendarsAndEvents((prev) =>
      prev.map((cal) =>
        cal.calendar.id === thisCalendarId
          ? {
              ...cal,
              events: [...cal.events, response.event],
            }
          : cal
      )
    );
  }

  // If it's a button day (clickable/selectable)
  if (isButton) {
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
            {props.date.getDate()}
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
          <> {props.date.getDate()}</>
        )}

        {visibleEvents}

        {canAddEvent ? (
          <Button
            onClick={() => addNewEvent(props.date)}
            style={{
              backgroundColor: "transparent",
              borderColor:
                contextCalendarsAndEvents[0]?.calendar?.color ?? "#cccccc",
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
