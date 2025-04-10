import { reportThisError } from "@/lib/logger";
import { tryCatch } from "@shared/src/tryCatch";
import axios from "axios";
import { NewInvitationsResponse } from "types";

export const useInvitationService = () => {
  const fetchInvitations = async (): Promise<
    NewInvitationsResponse[] | undefined
  > => {
    const [response, err] = await tryCatch(
      axios.get<NewInvitationsResponse[]>(
        "https://backend.localhost/new-invites"
      )
    );
    if (err) {
      reportThisError(err.message);
      return undefined;
    }
    return response.data;
  };

  return { fetchInvitations };
};
