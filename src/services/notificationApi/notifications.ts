import { api } from "../Api";
import {
  ApiResponse,
  ListRequestParams,
  PageResponse,
  searchParamsToQueryParams,
} from "../Api.types";
import { TNotification, TUnreadCont } from "./notifications.types";

const getUnreadCount = (): Promise<ApiResponse<TUnreadCont>> => {
  return api.get<TUnreadCont>("/v1/notifications/unread-count");
};

const getNotifications = (
  params: ListRequestParams
): Promise<ApiResponse<PageResponse<TNotification>>> => {
  const queryParams = searchParamsToQueryParams(params);
  return api.get<PageResponse<TNotification>>("/v1/notifications", {
    params: queryParams,
  });
};

const readNotification = (id: number): Promise<ApiResponse<TNotification>> => {
  return api.patch<TNotification>(`/v1/notifications/${id}/read`);
};

const readAllNotifications = (): Promise<ApiResponse<TNotification[]>> => {
  return api.patch<TNotification[]>(`/v1/notifications/read-all`);
};

export const notificationApi = {
  getUnreadCount,
  getNotifications,
  readNotification,
  readAllNotifications,
};
