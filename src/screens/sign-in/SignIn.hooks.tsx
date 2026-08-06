import { useAppNavigation } from "@/navigators";
import { useCallback, useLayoutEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { delay } from "@/utils";
import { useAppDispatch } from "@/hooks";
import { signIn } from "@/store";
import { SignInFormValues } from "@/schemas";
import { toast } from "sonner-native";
import { ThemeToggle } from "@/components/features";
import { useTranslation } from "react-i18next";

export const useSignIn = () => {
  const { t } = useTranslation("signIn");
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation<"SignIn">();

  const fakeSignInApi = async (values: SignInFormValues) => {
    await delay(1000);

    if (values.email === "test@test.com" && values.password === "Abc@123123") {
      return {
        token: "sample",
      };
    }

    throw new Error("Invalid email or password");
  };

  const signInMutation = useMutation({
    mutationFn: fakeSignInApi,
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message);
    },
    onSuccess: (data) => {
      dispatch(signIn(data));
    },
  });

  /// navigations
  useLayoutEffect(
    useCallback(() => {
      navigation.setOptions({
        title: t("title"),
        headerLargeTitle: true,
        headerShadowVisible: false,
        headerRight: () => <ThemeToggle />,
      });
    }, [])
  );

  return { signInMutation };
};
