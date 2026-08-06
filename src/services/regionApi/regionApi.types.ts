// Region basic info
export interface RegionResponse {
  code: string; // "US", "VN"
  name: string; // "United States"
  timezone: string; // "America/New_York"
  isOpen: boolean;
}

// Region status with detailed info
export interface RegionStatusResponse {
  region: string;
  name: string;
  timezone: string;
  isOpen: boolean;
  currentTime: string;
  todayOpen: string | null;
  todayClose: string | null;
  nextOpen: string | null;
  nextClose: string | null;
  closedReason: string | null;
}

// Trading hours for a day of week
export interface TradingHoursResponse {
  dayOfWeek: number; // 1-7 (Monday-Sunday)
  dayName: string; // "Monday"
  openTime: string | null; // "09:30:00"
  closeTime: string | null; // "16:00:00"
  isOpen: boolean;
  breakStartTime: string | null; // "11:30" - Start of lunch break (null if no break)
  breakEndTime: string | null; // "13:00" - End of lunch break (null if no break)
  hasLunchBreak: boolean; // Whether market has lunch break
  availableTimeSlots: string[]; // ["09:00", "09:30", ...] - 30-min intervals excluding lunch break
}

// Holiday
export interface HolidayResponse {
  id: number;
  holidayDate: string; // ISO instant
  description: string; // "Independence Day"
  dayName: string; // "Thursday"
}

export interface UpdateTradingHoursRequest {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isOpen: boolean;
  breakStartTime?: string | null;
  breakEndTime?: string | null;
}
