import { BACKEND_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import axios from "axios";
import {
  Calendar,
  CalendarCreateBody,
  CalendarUpdateBody,
  Event,
  Membership,
} from "@types";

export type CalendarAndEvents = { calendar: Calendar; events: Event[] };

interface PostCalendarResponse {
  calendar: Calendar;
  membership: Membership;
}

export const calendarService = {
  postCalendar: async (body: CalendarCreateBody) => {
    return handleApiRequest<PostCalendarResponse>(() =>
      axios.post(`${BACKEND_URL}/calendar/`, body)
    );
  },
  getCalendars: async () => {
    return handleApiRequest<Calendar[]>(() =>
      axios.get(`${BACKEND_URL}/calendars/`)
    );
  },
  getAllPersonalCalendars: async () => {
    return handleApiRequest<CalendarAndEvents[]>(() =>
      axios.get(`${BACKEND_URL}/calendar/all`)
    );
  },
  getCalendar: async (calendar_id: string) => {
    return handleApiRequest<CalendarAndEvents>(() =>
      axios.get(`${BACKEND_URL}/calendar/${calendar_id}`)
    );
  },
  patchCalendar: async (body: CalendarUpdateBody) => {
    return handleApiRequest<Calendar>(() =>
      axios.patch(`${BACKEND_URL}/calendar/`, body)
    );
  },
  deleteCalendar: async (calendar_id: number) => {
    return handleApiRequest<string>(() =>
      axios.delete(`${BACKEND_URL}/calendar/${calendar_id}`)
    );
  },
};
