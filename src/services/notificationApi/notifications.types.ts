export type TUnreadCont = {
  count: number;
};

export type TNotification = {
  id: number;
  type: string;
  title: string;
  message: string;
  readAt: string;
  createdAt: string;
  strategyId: number;
};
