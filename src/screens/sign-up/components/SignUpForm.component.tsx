import React from "react";
import {
  Form,
  InputField,
  Button,
  Icon,
  Text,
  Separator,
  SocialConnections,
  DateField,
} from "@/components";
import { View } from "react-native";
import { SignUpFormValues, signUpSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { useBoolean } from "@/hooks";
import { useTranslation } from "react-i18next";

type SignUpFormProps = {
  onSubmit: (values: SignUpFormValues) => Promise<void>;
  isLoading?: boolean;
};

export const SignUpForm = ({ onSubmit, isLoading }: SignUpFormProps) => {
  const { t } = useTranslation(["signUp", "common"]);
  const showPassword = useBoolean(false);
  const showConfirmPassword = useBoolean(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: undefined,
    },
  });

  return (
    <View className="gap-4 p-5">
      <Form {...form}>
        <InputField control={form.control} name="email" leadingIcon={Mail} />
        <InputField
          control={form.control}
          name="password"
          leadingIcon={Lock}
          containerClassName="pr-0"
          renderTrailingIcon={(props) => (
            <Button size="icon" variant="ghost" onPress={showPassword.toggle}>
              <Icon as={showPassword.value ? Eye : EyeOff} {...props} />
            </Button>
          )}
          secureTextEntry={!showPassword.value}
        />
        <InputField
          control={form.control}
          name="confirmPassword"
          leadingIcon={Lock}
          containerClassName="pr-0"
          renderTrailingIcon={(props) => (
            <Button
              size="icon"
              variant="ghost"
              onPress={showConfirmPassword.toggle}
            >
              <Icon as={showConfirmPassword.value ? Eye : EyeOff} {...props} />
            </Button>
          )}
          secureTextEntry={!showConfirmPassword.value}
        />
        <DateField control={form.control} name="dateOfBirth" mode="date" />
        <Button onPress={form.handleSubmit(onSubmit)} isLoading={isLoading}>
          <Text>{t("signUp:title")}</Text>
        </Button>

        <View className="flex-row items-center gap-2">
          <Separator className="flex-1" />
          <Text>{t("common:or")}</Text>
          <Separator className="flex-1" />
        </View>

        <SocialConnections />
      </Form>
    </View>
  );
};
