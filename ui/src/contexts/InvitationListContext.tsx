import { Calendar, NewInvitationsResponse } from "@types";
import { createContext, useContext } from "react";

type InvitationListContextType = {
  contextInvitations: NewInvitationsResponse[];
  contextDeleteInvitation: (id: number) => void;
  contextAddCalendar: (calendar: Calendar) => void;
};

export const InvitationListContext = createContext<
  InvitationListContextType | undefined
>(undefined);

export const useInvitationListContext = () => {
  const context = useContext(InvitationListContext);
  if (context) return context;

  throw new Error(
    "useInvitationListContext must be used within a DataProvider"
  );
};
