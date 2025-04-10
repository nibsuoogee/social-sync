import { reportThisError } from "@/lib/logger";
import { tryCatch } from "@shared/src/tryCatch";
import axios from "axios";

export const useEventService = () => {
  const fetchEvents = async (
    calendar_id: number
  ): Promise<Event[] | undefined> => {
    const [response, err] = await tryCatch(
      axios.get<Event[]>("https://backend.localhost/events/", {
        params: { calendar_id: calendar_id },
      })
    );
    if (err) {
      reportThisError(err.message);
      return undefined;
    }
    return response.data;
  };

  return { fetchEvents };
};
