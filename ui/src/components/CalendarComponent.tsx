import { JSX, RefObject, useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DayProps, useDayRender } from "react-day-picker";
import { useEventsContext } from "@/contexts/EventsContext";
import { EventBlock } from "@/components/EventBlock";
import { isSameDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MAX_VISIBLE_EVENTS = 3;

const CustomDayCell = (props: DayProps) => {
  const { contextCalendarsAndEvents } = useEventsContext();
  const [firstVisibleEvent, setFirstVisibleEvent] = useState<
    number | undefined
  >();
  const buttonRef = useRef<HTMLButtonElement>(
    null
  ) as RefObject<HTMLButtonElement>;
  const userCanAddEvents = contextCalendarsAndEvents.length === 1;

  const { isHidden, isButton, /*buttonProps,*/ divProps } = useDayRender(
    props.date,
    props.displayMonth,
    buttonRef
  );

  // day content
  const calendarsAndEventsFiltered = contextCalendarsAndEvents.map((ccae) => {
    const filteredEvents = ccae.events.filter((e) => {
      const eventDate = new Date(e.start_time); // ISO string -> Date object

      if (isSameDate(eventDate, props.date)) return true;

      return false;
    });

    return { calendar: ccae.calendar, events: filteredEvents };
  });

  // Add all events from all calendars as eventblocks to array
  // and then take a slice

  const allEventBlocksFiltered = calendarsAndEventsFiltered.flatMap(
    (filtered, index) => {
      const { calendar, events } = filtered;
      return events.map((event, eventIndex) => {
        return (
          <div key={`${index}-${eventIndex}`}>
            <EventBlock
              bgColor={calendar.color}
              title={event.title}
              startTime={event.start_time}
              endTime={event.end_time}
              customClass="min-h-6 max-h-10 h-min"
              allDay={event.all_day}
            />
          </div>
        );
      });
    }
  );

  useEffect(() => {
    setFirstVisibleEvent(allEventBlocksFiltered.length > 0 ? 0 : undefined);
  }, []);

  // Don't render if hidden (e.g., days from other months and showOutsideDays is false)
  if (isHidden) return <div {...divProps} />;

  let visibleEvents: JSX.Element[] = [];

  if (typeof firstVisibleEvent !== "undefined") {
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
    if (typeof firstVisibleEvent === "undefined") return true;

    return (
      firstVisibleEvent + MAX_VISIBLE_EVENTS > allEventBlocksFiltered.length
    );
  };

  const disablePreviousPage = () => {
    if (typeof firstVisibleEvent === "undefined") return true;

    return firstVisibleEvent - MAX_VISIBLE_EVENTS < 0;
  };

  // If it's a button day (clickable/selectable)
  if (isButton) {
    return (
      <div className="text-xs w-full h-full border-solid border-1 border-gray-200">
        {/* <button
          ref={buttonRef}
          {...buttonProps}
          className="h-10 w-10 rounded hover:bg-accent text-sm"
        ></button> */}
        {typeof firstVisibleEvent !== "undefined" &&
        allEventBlocksFiltered.length > MAX_VISIBLE_EVENTS ? (
          <div className="flex items-center justify-between">
            <Button
              onClick={previousPage}
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              disabled={disablePreviousPage() ?? false}
            >
              <ChevronLeft />
            </Button>
            {props.date.getDate()}
            <Button
              onClick={nextPage}
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              disabled={disableNextPage() ?? false}
            >
              <ChevronRight />
            </Button>
          </div>
        ) : (
          <> {props.date.getDate()}</>
        )}

        {visibleEvents}

        {userCanAddEvents ? (
          <EventBlock
            bgColor="transparent"
            borderColor={
              contextCalendarsAndEvents[0]?.calendar?.color ?? "#cccccc"
            }
            title=""
            customClass="h-4 border border-dashed border-3 bg-opacity-0 opacity-0 hover:opacity-100"
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

/**
 * The main calendar component in the calendar view.
 */
export const CalendarComponent = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      components={{ Day: CustomDayCell }}
    />
  );
};
