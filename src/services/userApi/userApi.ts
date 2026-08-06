import { api } from "../Api";
import { ApiResponse } from "../Api.types";
import { TUser } from "./userApi.types";

const getUser = (): Promise<ApiResponse<TUser>> => {
  return api.get<TUser>("/v1/user/me");
};

export const userApi = { getUser };
