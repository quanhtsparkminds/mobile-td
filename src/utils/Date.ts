import * as dateFns from "date-fns";
import { FormatOptions } from "date-fns";

export enum DateFormat {
  DEFAULT = "yyyy-MM-dd",
  LONG = "yyyy-MM-dd HH:mm:ss",
  SHORT = "MM/dd/yyyy",
  TIME = "HH:mm:ss",
  TIME_SHORT = "HH:mm",
  DATE = "MM/dd/yyyy",
  DATETIME = "MM/dd/yyyy HH:mm:ss",
}

export interface TimezoneFormatOptions {
  timezone?: string;
  locale?: string;
}

export const dateUtils = {
  /**
   * Format date using date-fns (no timezone support)
   */
  format: (
    date: any,
    format: DateFormat = DateFormat.DATETIME,
    options?: FormatOptions
  ) => {
    // check if the input is a valid date
    if (isNaN(new Date(date).getTime())) {
      return date;
    }
    return dateFns.format(date, format, options);
  },

  /**
   * Format datetime with timezone support using Intl API
   */
  formatWithTimezone: (
    date: string | Date | null,
    options?: TimezoneFormatOptions & {
      includeTime?: boolean;
      includeDate?: boolean;
    }
  ): string => {
    if (!date) return "--";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return String(date);

    const {
      timezone,
      locale = "en-US",
      includeTime = true,
      includeDate = true,
    } = options || {};

    const formatOptions: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
    };

    if (includeDate) {
      formatOptions.year = "numeric";
      formatOptions.month = "short";
      formatOptions.day = "numeric";
    }

    if (includeTime) {
      formatOptions.hour = "2-digit";
      formatOptions.minute = "2-digit";
      formatOptions.hour12 = false;
    }

    return new Intl.DateTimeFormat(locale, formatOptions).format(d);
  },

  /**
   * Format time string (HH:mm:ss) with timezone conversion
   * Takes a time string in source timezone and converts to target timezone
   */
  formatTimeWithTimezone: (
    timeString: string | null,
    sourceTimezone: string,
    targetTimezone: string
  ): string => {
    if (!timeString) return "--:--";

    // If same timezone, just return formatted time
    if (sourceTimezone === targetTimezone) {
      return timeString.slice(0, 5); // HH:mm
    }

    // Create a date object for today with the given time in source timezone
    const today = new Date();
    const [hours, minutes, seconds = "00"] = timeString.split(":");

    // Create ISO string with the time in source timezone
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    // Format the datetime string with timezone offset
    const dateTimeStr = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    const dateWithOffset = new Date(
      dateTimeStr + getTimezoneOffset(sourceTimezone)
    );

    // Get the time in target timezone
    return new Intl.DateTimeFormat("en-US", {
      timeZone: targetTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(dateWithOffset);
  },

  /**
   * Get user's local timezone
   */
  getLocalTimezone: (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  },
};

/**
 * Get timezone offset string for a timezone (approximate, for simple conversion)
 */
function getTimezoneOffset(timezone: string): string {
  const date = new Date();
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
  const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? "+" : "-";
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
