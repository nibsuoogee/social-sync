import { BACKEND_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import { GroupMemberInfo, Membership, MembershipColorUpdateBody } from "@types";
import axios from "axios";

export const membershipService = {
  getMembers: async (calendar_id: number) => {
    return handleApiRequest<GroupMemberInfo[]>(() =>
      axios.get(`${BACKEND_URL}/memberships/${calendar_id}`)
    );
  },
  changeColor: async (body: MembershipColorUpdateBody) => {
    return handleApiRequest<Membership>(() =>
      axios.patch(`${BACKEND_URL}/membership/color/`, body)
    );
  },
  deleteMembership: async (calendar_id: number) => {
    return handleApiRequest<number>(() =>
      axios.delete(`${BACKEND_URL}/memberships/${calendar_id}`)
    );
  },
};
