import { BACKEND_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import { AttendanceDetails } from "@types";
import axios from "axios";

export const attendanceService = {
  getAttendances: async (event_id: number) => {
    return handleApiRequest<AttendanceDetails[]>(() =>
      axios.get(`${BACKEND_URL}/attendances/${event_id}`)
    );
  },
};
