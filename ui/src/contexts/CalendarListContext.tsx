import { Calendar } from "@types";
import { createContext, useContext } from "react";

type CalendarListContextType = {
  contextCalendars: Calendar[];
  contextDeleteCalendar: (id: number) => void;
  contextAddCalendar: (calendar: Calendar) => void;
  contextEditCalendar: (calendar: Calendar) => void;
};

export const CalendarListContext = createContext<
  CalendarListContextType | undefined
>(undefined);

export const useCalendarListContext = () => {
  const context = useContext(CalendarListContext);
  if (context) return context;

  throw new Error("useCalendarListContext must be used within a DataProvider");
};
