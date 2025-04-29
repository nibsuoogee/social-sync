import { BACKEND_URL } from "@/lib/urls";
import { handleApiRequest } from "@/lib/requests";
import axios from "axios";
import {
  Calendar,
  InvitationBody,
  InvitationUpdateBody,
  NewInvitationsResponse,
} from "@types";

export const invitationService = {
  postInvite: async (body: InvitationBody) => {
    return handleApiRequest<string>(() =>
      axios.post(`${BACKEND_URL}/invite/`, body)
    );
  },
  getInvitations: async () => {
    return handleApiRequest<NewInvitationsResponse[]>(() =>
      axios.get(`${BACKEND_URL}/new-invites/`)
    );
  },
  patchInvitation: async (body: InvitationUpdateBody) => {
    return handleApiRequest<Calendar | string>(() =>
      axios.patch(`${BACKEND_URL}/invite/`, body)
    );
  },
};
