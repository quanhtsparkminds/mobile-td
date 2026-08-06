import { View } from "react-native";
import { FormField, FormLabel, FormMessage } from "./Form.component";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { SViewStyle } from "@/types";
import { SelectOption } from "@/types";
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export interface SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  style?: SViewStyle;
  options: SelectOption[];
  disabled?: boolean;
}

export function SelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  style,
  options,
  disabled,
}: SelectFieldProps<TFieldValues, TName>) {
  const { t } = useTranslation(["field"]);

  const contentInsets = useSafeAreaInsets();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const { error } = fieldState;
        const { value, onChange } = field;
        const { isSubmitting } = formState;

        const activeOption = options.find((option) => option?.value === value);
        const handleChange = (value: SelectOption) => onChange(value?.value);

        const resolvedLabel = label || t(`field:${name}.label` as any);

        return (
          <View style={style} className="gap-2">
            <FormLabel>{label}</FormLabel>
            <Select
              disabled={disabled || isSubmitting}
              value={activeOption}
              onValueChange={handleChange}
            >
              <SelectTrigger
                disabled={disabled || isSubmitting}
                className={cn(!!error?.message && "border-destructive")}
              >
                <SelectValue
                  placeholder={t(`field:${name}.placeholder` as any)}
                />
              </SelectTrigger>
              <SelectContent insets={contentInsets}>
                <NativeSelectScrollView>
                  <SelectGroup>
                    <SelectLabel>
                      {typeof resolvedLabel === "string"
                        ? resolvedLabel
                        : t(`field:${name}.label` as any)}
                    </SelectLabel>
                    {options.map((option, index) => (
                      <SelectItem
                        key={index}
                        label={option?.label ?? ""}
                        value={option?.value ?? ""}
                      />
                    ))}
                  </SelectGroup>
                </NativeSelectScrollView>
              </SelectContent>
            </Select>
            <FormMessage />
          </View>
        );
      }}
    />
  );
}
