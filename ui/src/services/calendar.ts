import { BACKEND_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import axios from "axios";
import {
  Calendar,
  CalendarCreateBody,
  CalendarUpdateBody,
  Membership,
} from "types";

interface PostCalendarResponse {
  calendar: Calendar;
  membership: Membership;
}

export const useCalendarService = () => {
  const postCalendar = async (body: CalendarCreateBody) => {
    return handleApiRequest<PostCalendarResponse>(() =>
      axios.post(`${BACKEND_URL}/calendar/`, { body })
    );
  };

  const getCalendars = async () => {
    return handleApiRequest<Calendar[]>(() =>
      axios.get(`${BACKEND_URL}/calendars/`)
    );
  };

  const patchCalendar = async (body: CalendarUpdateBody) => {
    return handleApiRequest<Calendar>(() =>
      axios.patch(`${BACKEND_URL}/calendar/`, { body })
    );
  };

  const deleteCalendar = async (calendar_id: number) => {
    return handleApiRequest<string>(() =>
      axios.delete(`${BACKEND_URL}/calendar/`, {
        params: { calendar_id },
      })
    );
  };

  return { postCalendar, getCalendars, patchCalendar, deleteCalendar };
};
