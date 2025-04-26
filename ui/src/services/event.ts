import { BACKEND_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import axios from "axios";
import { Event, EventModelBody } from "@types";

interface PostEventResponse {
  event: Event;
}

type EventPatchBody = { id: number } & Partial<Event>;

export const eventService = {
  postEvent: async (body: EventModelBody) => {
    return handleApiRequest<PostEventResponse>(() =>
      axios.post(`${BACKEND_URL}/event/`, body)
    );
  },
  patchEvent: async (body: EventPatchBody) => {
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
