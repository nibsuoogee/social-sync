import { defaultCalendarView } from "@/lib/defaultObjects";
import { deepCopy } from "@/lib/utils";
import { CalendarVariant, CalendarViewRequest } from "@types";
import { createContext, ReactNode, useContext, useState } from "react";

type EventsContextType = {
  contextCalendarVariant: CalendarVariant;
  contextSetCalendarVariant: (value: CalendarVariant) => void;
  contextCalendarView: CalendarViewRequest;
  contextSetCalendarView: React.Dispatch<
    React.SetStateAction<CalendarViewRequest>
  >;
};

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (context) return context;

  throw new Error("useEventsContext must be used within a DataProvider");
};

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [contextCalendarVariant, contextSetCalendarVariant] =
    useState<CalendarVariant>("single");
  const [contextCalendarView, contextSetCalendarView] =
    useState<CalendarViewRequest>(deepCopy(defaultCalendarView));

  return (
    <EventsContext.Provider
      value={{
        contextCalendarVariant,
        contextSetCalendarVariant,
        contextCalendarView,
        contextSetCalendarView,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
