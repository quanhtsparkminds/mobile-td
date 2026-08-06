import BigNumber from "bignumber.js";

/**
 * Regex that we use in this helper
 */
const regex = {
  /**
   * replace all the "," with "."
   */
  replaceCommas: /,/g,
  /**
   * only accept number
   */
  onlyNumber: /^[0-9]*$/,
  /**
   * only accept number and "."
   */
  onlyNumberAndDot: /[^0-9.]/g,
  /**
   * thousan format
   */
  thousan: /\B(?=(\d{3})+(?!\d))/g,
  /**
   * trailing zeros after decimal point
   */
  trailingZeros: /\.?0+$/,
};

/**
 * Remove trailing zeros from a formatted number string
 * @param value - The formatted string (may contain commas)
 * @returns String without trailing zeros
 * @example "1,234.50" => "1,234.5"
 * @example "1,234.00" => "1,234"
 * @example "0.00100000" => "0.001"
 */
const stripTrailingZeros = (value: string): string => {
  if (!value.includes(".")) return value;
  return value.replace(regex.trailingZeros, "");
};

/**
 *
 * @param text formated amount
 * @returns amount just include number and "."
 * @example 1,234.56 => 1234.56
 */
const clean = (text: string = "") => text.replace(regex.onlyNumberAndDot, "");

/**
 *
 * @param text raw amount
 * @returns amount includes comma every 3 chars
 * @example 1234567 => 1,234,567
 */
const format = (text: string = "", decimal?: number) => {
  // Split the cleaned text into integer and fractional parts
  const [integerPart, fractionalPart] = text.split(".");

  // Format the integer part with commas
  const formattedInteger = integerPart.replace(regex.thousan, ",");

  return text?.includes(".")
    ? `${formattedInteger}.${fractionalPart?.slice(
        0,
        decimal ?? fractionalPart?.length ?? 0
      )}`
    : formattedInteger;
};

type TFormatAmountParamsOptions = {
  maxDecimals: number;
  maxAmount: number;
};

/**
 *
 * @param prev the previous value (formated)
 * @param next the value that user just entered
 * @param maxDecimals the maximum chars after the "."
 * @param maxAmount the maximum value that user can enter
 * @returns the value after fully formated
 */
const formatAmount = (
  prev: string = "",
  next: string = "",
  { maxDecimals, maxAmount }: TFormatAmountParamsOptions
) => {
  if (!next) return "";

  // There are some keyboard that the decimal symbol is not ".", it's "," so we need to check and add the "." to the end of text if needed
  const isNeedToAddDotToTheEnd = next.length > 1 && next.endsWith(",");

  next = clean(next);

  if (isNeedToAddDotToTheEnd) next += ".";

  // nếu ký tự đầu tiên ko phải là số thì return
  // if the first letter is not number then return
  if (!regex.onlyNumber.test(next.charAt(0))) {
    return prev;
  }

  // nếu ký tự đầu tiên là 0 và ký tự liền kề nó là số và giá trị mới có lengh > 1 thì xóa số 0 ở đầu đi
  // if the first letter is 0 and the next letter is number and the length of next value is greather than 1 then remove the leading zero
  if (
    next.charAt(0) === "0" &&
    regex.onlyNumber.test(next.charAt(1)) &&
    next.length > 1
  ) {
    return next.slice(1, next.length);
  }

  // thay toàn bộ "," thành "."
  // replace all the "," with "."
  next = next.replace(regex.replaceCommas, ".");

  // if the next value is greater than max amount then return the previous value
  if (BigNumber(next).isGreaterThan(maxAmount)) {
    return format(prev);
  }

  // nếu giá trị mới có dấu chấm ở cuối thì trả về giá trị mới
  // if the previous value doesn't include "." and the next value includes "." or the next value includes "." at the end then return next value
  if (next.charAt(next.length - 1) === "." && maxDecimals !== 0) {
    return format(next);
  }

  if (next?.includes(".") && next?.split(".")?.[1]?.length > maxDecimals) {
    return prev;
  }

  return format(next);
};

export type Numberish = string | number | BigNumber;

/**
 * Format amount with currency symbol
 * @param amount - The amount to format
 * @param currencySymbol - Currency symbol (e.g., "$", "€", "₨")
 * @param decimal - Number of decimal places
 * @param showSign - Whether to show +/- sign for positive/negative amounts
 * @returns Formatted amount string with currency symbol
 * @example formatAmountWithSymbol(1000, "S$", 2, true) => "S$1,000.00"
 * @example formatAmountWithSymbol(-1000, "€", 2, true) => "-€1,000.00"
 */
const formatAmountWithSymbol = (
  amount: Numberish,
  currencySymbol: string = "",
  decimal: number = 2,
  showMinus: boolean = true,
  showPlus: boolean = false
): string => {
  const bn = BigNumber(amount);

  if (bn.isNaN()) {
    return "";
  }

  const formattedAmount = stripTrailingZeros(
    format(String(amount).replace("-", ""), decimal)
  );

  let sign = "";
  if (showMinus && bn.isNegative()) {
    sign = "-";
  } else if (showPlus && bn.isPositive()) {
    sign = "+";
  }

  return `${sign}${formattedAmount} ${currencySymbol}`;
};

/**
 * Format amount with optional +/- sign (no currency symbol)
 * @param amount - The amount to format
 * @param decimal - Number of decimal places
 * @param showMinus - Whether to show - sign for negative amounts
 * @param showPlus - Whether to show + sign for positive amounts
 * @returns Formatted amount string with optional sign
 * @example formatAmountWithSign(1000, 2, true, true) => "+1,000.00"
 * @example formatAmountWithSign(-1000, 2, true, false) => "-1,000.00"
 */
const formatAmountWithSign = (
  amount: Numberish,
  decimal: number = 2,
  showMinus: boolean = true,
  showPlus: boolean = false
): string => {
  const bn = BigNumber(amount);

  if (bn.isNaN()) {
    return "";
  }

  const formattedAmount = stripTrailingZeros(
    format(String(amount).replace("-", ""), decimal)
  );

  let sign = "";
  if (showMinus && bn.isNegative()) {
    sign = "-";
  } else if (showPlus && bn.isPositive()) {
    sign = "+";
  }

  return `${sign}${formattedAmount}`;
};

/**
 * Format exchange rate between two currencies
 * @param fromSymbol - Source currency symbol
 * @param toSymbol - Target currency symbol
 * @param rate - Exchange rate
 * @param decimal - Number of decimal places for rate
 * @returns Formatted rate string
 */
const formatExchangeRate = (
  fromSymbol: string,
  toSymbol: string,
  rate: number
): string => {
  const formattedRate = stripTrailingZeros(
    format(BigNumber(rate).toString(), 18)
  );
  return `1 ${fromSymbol} = ${formattedRate} ${toSymbol}`;
};

const transformAmountToNull = (amount: number | undefined): number | null => {
  if (amount === undefined || amount === 0) return null;
  return amount;
};

export const amountUtils = {
  clean,
  format,
  formatAmount,
  formatAmountWithSign,
  formatAmountWithSymbol,
  formatExchangeRate,
  transformAmountToNull,
};
