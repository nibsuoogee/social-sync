import { Calendar, Event } from "@types";
import { createContext, ReactNode, useContext, useState } from "react";

type EventsContextType = {
  contextCalendar: Calendar | undefined;
  contextHandleSetCalendar: (events: Calendar) => void;
  contextEvents: Event[];
  contextHandleSetEvents: (events: Event[]) => void;
};

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEventsContext = () => {
  const context = useContext(EventsContext);
  if (context) return context;

  throw new Error("useEventsContext must be used within a DataProvider");
};

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [contextCalendar, contextSetCalendar] = useState<Calendar | undefined>(
    undefined
  );
  const [contextEvents, contextSetEvents] = useState<Event[]>([]);

  const contextHandleSetCalendar = (calendar: Calendar) => {
    contextSetCalendar(calendar);
  };
  const contextHandleSetEvents = (events: Event[]) => {
    contextSetEvents(events);
  };
  return (
    <EventsContext.Provider
      value={{
        contextEvents,
        contextHandleSetEvents,
        contextCalendar,
        contextHandleSetCalendar,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
