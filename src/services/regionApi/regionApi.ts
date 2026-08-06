import { api } from "../Api";
import { ApiResponse } from "../Api.types";
import * as Types from "./regionApi.types";

const getRegions = (): Promise<ApiResponse<Types.RegionResponse[]>> => {
  return api.get<Types.RegionResponse[]>("/v1/markets/regions");
};

// Check if a region's market is open
const isRegionOpen = (regionCode: string): Promise<ApiResponse<boolean>> => {
  return api.get<boolean>(`/v1/markets/regions/${regionCode}/is-open`);
};

// Get detailed status of a region
const getRegionStatus = (
  regionCode: string
): Promise<ApiResponse<Types.RegionStatusResponse>> => {
  return api.get<Types.RegionStatusResponse>(
    `/v1/markets/regions/${regionCode}/status`
  );
};

// Get trading hours for a region
const getTradingHours = (
  regionCode: string
): Promise<ApiResponse<Types.TradingHoursResponse[]>> => {
  return api.get<Types.TradingHoursResponse[]>(
    `/v1/markets/regions/${regionCode}/hours`
  );
};

// Get available time slots for a region (30-min intervals, excluding lunch break)
const getTimeSlots = (regionCode: string): Promise<ApiResponse<string[]>> => {
  return api.get<string[]>(`/v1/markets/regions/${regionCode}/time-slots`);
};

// Update trading hours for a region
const updateTradingHours = (
  regionCode: string,
  data: Types.UpdateTradingHoursRequest
): Promise<ApiResponse<Types.TradingHoursResponse[]>> => {
  return api.put<Types.TradingHoursResponse[]>(
    `/v1/markets/regions/${regionCode}/hours`,
    data
  );
};

// Get holidays for a region
const getHolidays = (
  regionCode: string,
  days: number = 365
): Promise<ApiResponse<Types.HolidayResponse[]>> => {
  return api.get<Types.HolidayResponse[]>(
    `/v1/markets/regions/${regionCode}/holidays`,
    { params: { days } }
  );
};

export const regionApi = {
  getRegions,
  isRegionOpen,
  getRegionStatus,
  getTradingHours,
  getTimeSlots,
  updateTradingHours,
  getHolidays,
};
