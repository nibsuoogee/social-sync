import { RefObject, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DayProps, useDayRender } from "react-day-picker";
import { useEventsContext } from "@/contexts/EventsContext";
import { EventBlock } from "@/components/EventBlock";

const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const CustomDayCell = (props: DayProps) => {
  const { contextEvents, contextCalendar } = useEventsContext();
  const buttonRef = useRef<HTMLButtonElement>(
    null
  ) as RefObject<HTMLButtonElement>;

  const { isHidden, isButton, /*buttonProps,*/ divProps } = useDayRender(
    props.date,
    props.displayMonth,
    buttonRef
  );

  // Don't render if hidden (e.g., days from other months and showOutsideDays is false)
  if (isHidden) return <div {...divProps} />;

  // day content
  const eventsOfDay = contextEvents.filter((e) => {
    const eventDate = new Date(e.start_time); // ISO string -> Date object

    if (isSameDate(eventDate, props.date)) return true;

    return false;
  });

  const eventBlocks = eventsOfDay.map((event, index) => {
    if (!contextCalendar) return <div key={index}></div>;
    return (
      <div key={index}>
        <EventBlock bgColor={contextCalendar.color} title={event.title} />
      </div>
    );
  });

  // If it's a button day (clickable/selectable)
  if (isButton) {
    return (
      <div className="w-full h-full border-solid border-1 border-gray-200">
        {/* <button
          ref={buttonRef}
          {...buttonProps}
          className="h-10 w-10 rounded hover:bg-accent text-sm"
        ></button> */}
        {props.date.getDate()}
        {eventBlocks}
        <EventBlock
          bgColor="transparent"
          borderColor={contextCalendar?.color ?? "#cccccc"}
          title=""
          customClass="border border-dashed border-3 bg-opacity-0 opacity-0 hover:opacity-100"
        />
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
