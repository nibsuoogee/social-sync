import { CalendarViewRequest, Event } from "@types";

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

export const defaultEvent: Event = {
  id: 0,
  ics_uid: "",
  title: "",
  description: "",
  location: "",
  start_time: new Date(),
  end_time: new Date(),
  timezone: "",
  all_day: false,
  recurrence_rule: "",
  status: "tentative",
  created_at: new Date(),
  updated_at: new Date(),
  proposed_by_user_id: 0,
  user_read_only: false,
};

export const defaultCalendarView: CalendarViewRequest = {
  mainCalendar: [],
  personalCalendars: [],
  groupMemberCalendars: [],
};
