import { defaultCalendarView } from "@/lib/defaultObjects";
import { deepCopy } from "@/lib/utils";
import { ProcessorEvent } from "@/services/processor";
import { CalendarVariant, CalendarViewKey, CalendarViewRequest } from "@types";
import { createContext, ReactNode, useContext, useState } from "react";

export const calendarViewKeys: CalendarViewKey[] = [
  "mainCalendar",
  "personalCalendars",
  "groupMemberCalendars",
];

type EventsContextType = {
  contextCalendarVariant: CalendarVariant;
  contextSetCalendarVariant: (value: CalendarVariant) => void;
  contextCalendarView: CalendarViewRequest;
  contextSetCalendarView: React.Dispatch<
    React.SetStateAction<CalendarViewRequest>
  >;
  contextEventProposals: ProcessorEvent[];
  contextSetEventProposals: React.Dispatch<
    React.SetStateAction<ProcessorEvent[]>
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
  const [contextEventProposals, contextSetEventProposals] = useState<
    ProcessorEvent[]
  >([]);

  return (
    <EventsContext.Provider
      value={{
        contextCalendarVariant,
        contextSetCalendarVariant,
        contextCalendarView,
        contextSetCalendarView,
        contextEventProposals,
        contextSetEventProposals,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
