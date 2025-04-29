import { PROCESSOR_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import axios from "axios";

export type ProcessorEvent = {
  id: number;
  start_time: Date;
  end_time: Date;
  timezone: string;
  all_day: boolean;
};

export const processorService = {
  generateProposals: async (events: ProcessorEvent[]) => {
    return handleApiRequest<{ proposals: ProcessorEvent[] }>(() =>
      axios.post(`${PROCESSOR_URL}/generate-proposals`, { events })
    );
  },
};
