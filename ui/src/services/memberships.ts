import { BACKEND_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import axios from "axios";

export const membershipService = {
  deleteMembership: async (calendar_id: number) => {
    return handleApiRequest<number>(() =>
      axios.delete(`${BACKEND_URL}/memberships/${calendar_id}`)
    );
  },
};
