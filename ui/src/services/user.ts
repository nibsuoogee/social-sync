import { AUTH_URL } from "@/lib/constants";
import { handleApiRequest } from "@/lib/requests";
import axios from "axios";
import {
  AccessToken,
  UserModelForLogin,
  UserModelForRegistration,
} from "types";

export const useUserService = () => {
  const postRegister = async (body: UserModelForRegistration) => {
    return handleApiRequest<AccessToken>(() =>
      axios.post(`${AUTH_URL}/register/`, { body })
    );
  };

  const postLogin = async (body: UserModelForLogin) => {
    return handleApiRequest<AccessToken>(() =>
      axios.post(`${AUTH_URL}/login/`, { body })
    );
  };

  return { postRegister, postLogin };
};
