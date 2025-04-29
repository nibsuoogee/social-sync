import { BACKEND_URL } from "@/lib/urls";
import { handleApiRequest } from "@/lib/requests";
import axios from "axios";
import { Calendar, CalendarCreateBody, Event, Membership } from "@types";

export type CalendarAndEvents = { calendar: Calendar; events: Event[] };

interface PostCalendarResponse {
  calendar: Calendar;
  membership: Membership;
}

export const importService = {
  postCalendar: async (body: CalendarCreateBody) => {
    return handleApiRequest<PostCalendarResponse>(() =>
      axios.post(`${BACKEND_URL}/import/`, body)
    );
  },
};
