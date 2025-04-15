import { CalendarCell } from "@/components/calendar/CalendarCell";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

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
      components={{ Day: CalendarCell }}
    />
  );
};
