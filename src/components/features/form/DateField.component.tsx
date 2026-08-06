import React from "react";
import { View } from "react-native";
import { FormField, FormLabel, FormMessage } from "./Form.component";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { SViewStyle } from "@/types";
import { Button, Input } from "@/components/ui";
import { Calendar } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useBoolean } from "@/hooks";
import { useColors } from "@/hooks";
import { useTranslation } from "react-i18next";

import DatePicker, { DatePickerProps } from "react-native-date-picker";

export interface DateFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<DatePickerProps, "date" | "onDateChange"> {
  containerClassName?: string;
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  style?: SViewStyle;
}

export function DateField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  style,
  containerClassName,
  ...rest
}: DateFieldProps<TFieldValues, TName>) {
  const { t, i18n } = useTranslation(["field", "common"]);

  const open = useBoolean();
  const colors = useColors();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const { error } = fieldState;
        const { value, onChange } = field;
        const { isSubmitting } = formState;

        const date = value ? new Date(value) : new Date();
        const handleChange = (date: Date) => {
          onChange(date.toISOString());
          open.setFalse();
        };

        const resolvedLabel = label || t(`field:${name}.label` as any);

        return (
          <View style={style} className="gap-2">
            <FormLabel>{label}</FormLabel>
            <Button onPress={open.setTrue} variant="ghost" className="px-0">
              <Input
                leadingIcon={Calendar}
                editable={!isSubmitting}
                containerClassName={cn(
                  !!error?.message && "border-destructive",
                  "pointer-events-none",
                  containerClassName
                )}
                placeholder={t(`field:${name}.placeholder` as any)}
                value={format(date, "dd/MM/yyyy")}
              />
            </Button>
            <DatePicker
              {...rest}
              date={date}
              modal
              open={open.value}
              onConfirm={handleChange}
              onCancel={open.setFalse}
              title={
                typeof resolvedLabel === "string" ? resolvedLabel : undefined
              }
              confirmText={t("common:confirm")}
              cancelText={t("common:cancel")}
              buttonColor={colors.primary}
              dividerColor={colors.primary}
              locale={i18n.language}
            />
            <FormMessage />
          </View>
        );
      }}
    />
  );
}
