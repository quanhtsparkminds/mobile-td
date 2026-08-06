import { useCallback, useLayoutEffect } from "react";
import { useAppNavigation } from "@/navigators";
import { useTranslation } from "react-i18next";

export const useSignUp = () => {
  const navigation = useAppNavigation<"SignUp">();
  const { t } = useTranslation("signUp");

  /// navigations
  useLayoutEffect(
    useCallback(() => {
      navigation.setOptions({
        title: t("title"),
        headerLargeTitle: true,
        headerShadowVisible: false,
      });
    }, [])
  );

  return {};
};
