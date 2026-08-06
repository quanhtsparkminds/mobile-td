import { useAppDispatch } from "@/hooks/Redux.hooks";
import { useTranslation } from "react-i18next";
import { signOut } from "@/store";
import { Alert } from "react-native";

export const useSignOut = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const prompt = () =>
    Alert.alert(t("signOut.modal.title"), t("signOut.modal.message"), [
      {
        text: t("common.cancel"),
      },
      {
        text: t("common.signOut"),
        onPress: async () => {
          // await apiUser.logout();
          dispatch(signOut());
        },
      },
    ]);

  return { prompt };
};
