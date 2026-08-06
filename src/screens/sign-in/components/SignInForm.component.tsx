import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInFormValues } from "@/schemas";
import { View } from "react-native";
import { Form, InputField, SocialConnections } from "@/components/features";
import { Button, Text, Separator, Icon } from "@/components";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useBoolean } from "@/hooks";
import { AppStackNavigationProps } from "@/navigators";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

type SignInFormProps = {
  onSubmit: (values: SignInFormValues) => Promise<{ token: string }>;
  isLoading?: boolean;
};

export const SignInForm = ({ onSubmit, isLoading }: SignInFormProps) => {
  const { t } = useTranslation(["signIn", "forgotPassword", "common"]);
  const navigation = useNavigation<AppStackNavigationProps<"SignIn">>();

  const showPassword = useBoolean(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleForgotPassword = () => navigation.navigate("ForgotPassword");

  const handleSignUp = () => navigation.navigate("SignUp");

  return (
    <Form {...form}>
      <View className="gap-4 p-5">
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
        <Button
          variant="link"
          size="link"
          className="ml-auto"
          onPress={handleForgotPassword}
        >
          <Text>{t("forgotPassword:title")}</Text>
        </Button>
        <Button onPress={form.handleSubmit(onSubmit)} isLoading={isLoading}>
          <Text>{t("signIn:title")}</Text>
        </Button>
        <Button variant="link" size="link" onPress={handleSignUp}>
          <Text>
            {t("signIn:dontHaveAccount")}{" "}
            <Text className="underline">{t("signIn:signUp")}</Text>
          </Text>
        </Button>
        <View className="flex-row items-center gap-2">
          <Separator className="flex-1" />
          <Text>{t("common:or")}</Text>
          <Separator className="flex-1" />
        </View>

        <SocialConnections />
      </View>
    </Form>
  );
};
