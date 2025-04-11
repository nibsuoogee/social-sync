import { reportThisError } from "@/lib/logger";
import { tryCatch } from "../../../shared/src/tryCatch";
import { AxiosResponse } from "axios";

/**
 * A helper function to handle API requests. Catches possible errors
 * and logs them using our logger.
 */
export const handleApiRequest = async <T>(
  apiCall: () => Promise<AxiosResponse<T>>
): Promise<T | undefined> => {
  const [response, err] = await tryCatch(apiCall());
  if (err) {
    reportThisError(err.message);
    return undefined;
  }
  return response.data;
};
