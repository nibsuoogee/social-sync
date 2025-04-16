import { CalendarAndEvents } from "@/services/calendar";
import { createContext, ReactNode, useContext, useState } from "react";

type EventsContextType = {
  contextCalendarsAndEvents: CalendarAndEvents[];
  contextHandleCalendarsAndEvents: (value: CalendarAndEvents[]) => void;
};

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (context) return context;

  throw new Error("useEventsContext must be used within a DataProvider");
};

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [contextCalendarsAndEvents, contextSetCalendarsAndEvents] = useState<
    CalendarAndEvents[]
  >([]);

  const contextHandleCalendarsAndEvents = (value: CalendarAndEvents[]) => {
    contextSetCalendarsAndEvents(value);
  };
  return (
    <EventsContext.Provider
      value={{
        contextCalendarsAndEvents,
        contextHandleCalendarsAndEvents,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
