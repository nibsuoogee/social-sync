import { CalendarViewRequest } from "@types";

export const defaultEventModelBody = {
  calendar_id: 0,
  title: "",
  description: "",
  location: "",
  start_time: new Date(),
  end_time: new Date(),
  timezone: "",
  all_day: false,
  recurrence_rule: "",
};

export const defaultCalendarView: CalendarViewRequest = {
  mainCalendar: [],
  personalCalendars: [],
  groupMemberCalendars: [],
};
