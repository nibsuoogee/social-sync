import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

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
    />
  );
};
