import { Event } from "@types";
import { createContext, ReactNode, useContext, useState } from "react";

type EventsContextType = {
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
  const [contextEvents, contextSetEvents] = useState<Event[]>([]);

  const contextHandleSetEvents = (events: Event[]) => {
    contextSetEvents(events);
  };
  return (
    <EventsContext.Provider value={{ contextEvents, contextHandleSetEvents }}>
      {children}
    </EventsContext.Provider>
  );
};
