import { TxKeyPath } from "@/i18n";

export const DEFAULT_COLOR_SCHEME_NAME: "light" | "dark" = "dark";

export const DEFAULT_PAGE_SIZE = 10;

export const ERROR_MESSAGE_KEYS: Record<string, TxKeyPath> = {
  REQUIRED: "errorMessage.required",
  INVALID: "errorMessage.invalid",
  PASSWORD_MISMATCH: "errorMessage.passwordMismatch",
} as const;

export const MAX_AMOUNT = Infinity;
export const MIN_DECIMALS = 2;
export const MAX_DECIMALS = 8;