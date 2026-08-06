import { View } from "react-native";
import { FormField, FormLabel, FormMessage } from "./Form.component";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { SViewStyle } from "@/types";
import { Input, InputProps } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export interface InputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends InputProps {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  style?: SViewStyle;
  onChangeText?: (value: string) => void;
}

export function InputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  style,
  onChangeText,
  ...rest
}: InputFieldProps<TFieldValues, TName>) {
  const { t } = useTranslation("field");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const { error } = fieldState;
        const { isSubmitting } = formState;

        return (
          <View style={style} className="gap-2">
            <FormLabel>{label}</FormLabel>
            <Input
              {...rest}
              value={field.value}
              onChangeText={onChangeText ?? field.onChange}
              placeholder={rest.placeholder || t(`${name}.placeholder` as any)}
              containerClassName={cn(
                !!error?.message && "border-destructive",
                rest.containerClassName
              )}
              editable={!isSubmitting && rest.editable}
            />
            <FormMessage />
          </View>
        );
      }}
    />
  );
}
