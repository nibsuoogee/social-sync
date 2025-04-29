import { BACKEND_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import { AttendanceDetails, AttendanceUpdateBody } from "@types";
import axios from "axios";

export const attendanceService = {
  getAttendances: async (event_id: number) => {
    return handleApiRequest<AttendanceDetails[]>(() =>
      axios.get(`${BACKEND_URL}/attendances/${event_id}`)
    );
  },
  patchAttendance: async (body: AttendanceUpdateBody) => {
    return handleApiRequest<string>(() =>
      axios.patch(`${BACKEND_URL}/attendance/`, body)
    );
  },
};
