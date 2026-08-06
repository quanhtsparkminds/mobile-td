import { en } from "@/i18n/EN";
import { useTranslation } from "react-i18next";

export function useEnumSelection<T extends Record<string, string>>(
  input: T,
  prefix: keyof (typeof en)["enum"]
) {
  const { t } = useTranslation(["enum"]);

  return Object.values(input).map((value) => ({
    label: t(`enum:${prefix}.${value}`, { defaultValue: value }),
    value,
  }));
}

export type UseEnumSelection = ReturnType<typeof useEnumSelection>;
