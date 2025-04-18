import { BACKEND_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import { GroupMemberInfo } from "@types";
import axios from "axios";

export const membershipService = {
  getMembers: async (calendar_id: number) => {
    return handleApiRequest<GroupMemberInfo[]>(() =>
      axios.get(`${BACKEND_URL}/memberships/${calendar_id}`)
    );
  },
  deleteMembership: async (calendar_id: number) => {
    return handleApiRequest<number>(() =>
      axios.delete(`${BACKEND_URL}/memberships/${calendar_id}`)
    );
  },
};
