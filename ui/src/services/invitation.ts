import { BACKEND_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import axios from "axios";
import {
  InvitationBody,
  InvitationUpdateBody,
  NewInvitationsResponse,
} from "types";

export const useInvitationService = () => {
  const postInvite = async (body: InvitationBody) => {
    return handleApiRequest<string>(() =>
      axios.post(`${BACKEND_URL}/invite/`, { body })
    );
  };

  const getInvitations = async () => {
    return handleApiRequest<NewInvitationsResponse[]>(() =>
      axios.get(`${BACKEND_URL}/new-invites/`)
    );
  };

  const patchInvitation = async (body: InvitationUpdateBody) => {
    return handleApiRequest<string>(() =>
      axios.patch(`${BACKEND_URL}/invite/`, { body })
    );
  };

  return { postInvite, getInvitations, patchInvitation };
};
