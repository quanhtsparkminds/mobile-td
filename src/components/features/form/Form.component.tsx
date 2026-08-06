import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui";
import { cn } from "@/lib/utils";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormItem({ children }: React.PropsWithChildren) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      {children}
    </FormItemContext.Provider>
  );
}

function FormLabel({ children, ...props }: React.ComponentProps<typeof Label>) {
  const { error, formItemId, name } = useFormField();
  const { t } = useTranslation("field");

  const label = t(`${name}.label`, { defaultValue: name });

  return (
    <Label
      data-error={!!error}
      {...props}
      accessibilityLabel="form-label"
      id={formItemId}
      className={cn(
        "transition-colors",
        props.className,
        !!error && "text-destructive"
      )}
    >
      {children || label}
    </Label>
  );
}

const AnimatedLabel = Animated.createAnimatedComponent(Label);

function FormMessage(props: React.ComponentProps<typeof Label>) {
  const { error } = useFormField();
  const { t } = useTranslation(["errorMessage"]);

  return error ? (
    <AnimatedLabel
      {...props}
      entering={FadeIn}
      exiting={FadeOut}
      className={cn("text-sm text-destructive", props.className)}
    >
      {t(error?.message ?? "", t("errorMessage:required"))}
    </AnimatedLabel>
  ) : null;
}

export { useFormField, Form, FormItem, FormLabel, FormField, FormMessage };
