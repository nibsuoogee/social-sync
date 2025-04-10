import { reportThisError } from "@/lib/logger";
import { tryCatch } from "@shared/src/tryCatch";
import axios from "axios";
import { Calendar } from "types";

export const useCalendarService = () => {
  const fetchCalendars = async (): Promise<Calendar[] | undefined> => {
    const [response, err] = await tryCatch(
      axios.get<Calendar[]>("https://backend.localhost/calendars")
    );
    if (err) {
      reportThisError(err.message);
      return undefined;
    }
    return response.data;
  };

  return { fetchCalendars };
};
