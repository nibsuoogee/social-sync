import { BACKEND_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import axios from "axios";
import {
  Attendance,
  Event,
  EventModelBody,
  EventsCalendarsModel,
} from "@types";

interface PostEventResponse {
  event: Event;
  eventsCalendar: EventsCalendarsModel;
  newAttendance: Attendance;
}

export const eventService = {
  postEvent: async (body: EventModelBody) => {
    return handleApiRequest<PostEventResponse>(() =>
      axios.post(`${BACKEND_URL}/event/`, body)
    );
  },
  getEvents: async (calendar_id: number) => {
    return handleApiRequest<Event[]>(() =>
      axios.get(`${BACKEND_URL}/events/${calendar_id}`)
    );
  },
  patchEvent: async (body: EventModelBody) => {
    return handleApiRequest<Event>(() =>
      axios.patch(`${BACKEND_URL}/event/`, body)
    );
  },
  deleteEvent: async (event_id: number) => {
    return handleApiRequest<string>(() =>
      axios.delete(`${BACKEND_URL}/event/${event_id}`)
    );
  },
};
