import { BACKEND_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import axios from "axios";
import { Attendance, Event, EventModelBody, EventsCalendarsModel } from "types";

interface PostEventResponse {
  event: Event;
  eventsCalendar: EventsCalendarsModel;
  newAttendance: Attendance;
}

export const useEventService = () => {
  const postEvent = async (body: EventModelBody) => {
    return handleApiRequest<PostEventResponse>(() =>
      axios.post(`${BACKEND_URL}/event/`, { body })
    );
  };

  const getEvents = async (calendar_id: number) => {
    return handleApiRequest<Event[]>(() =>
      axios.get(`${BACKEND_URL}/events/`, {
        params: { calendar_id },
      })
    );
  };

  const patchEvent = async (body: EventModelBody) => {
    return handleApiRequest<Event>(() =>
      axios.patch(`${BACKEND_URL}/event/`, { body })
    );
  };

  const deleteEvent = async (event_id: number) => {
    return handleApiRequest<string>(() =>
      axios.delete(`${BACKEND_URL}/event/`, {
        params: { event_id },
      })
    );
  };

  return { postEvent, getEvents, patchEvent, deleteEvent };
};
