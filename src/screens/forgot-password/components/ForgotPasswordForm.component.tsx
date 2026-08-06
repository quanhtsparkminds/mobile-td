import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "@/schemas";
import { View } from "react-native";
import { Form, InputField } from "@/components/features";
import { Button, Text } from "@/components";
import { Mail } from "lucide-react-native";
import { useTranslation } from "react-i18next";

type ForgotPasswordFormProps = {
  onSubmit: (values: ForgotPasswordFormValues) => void;
  isLoading?: boolean;
};

export const ForgotPasswordForm = ({
  onSubmit,
  isLoading,
}: ForgotPasswordFormProps) => {
  const { t } = useTranslation(["forgotPassword"]);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <Form {...form}>
      <View className="gap-4 p-5">
        <InputField control={form.control} name="email" leadingIcon={Mail} />

        <Button onPress={form.handleSubmit(onSubmit)} isLoading={isLoading}>
          <Text>{t("forgotPassword:submitButton")}</Text>
        </Button>
      </View>
    </Form>
  );
};
