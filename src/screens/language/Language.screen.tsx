import React, { useLayoutEffect } from "react";
import { SupportedLngs } from "@/i18n";
import { useTranslation } from "react-i18next";
import { useAppNavigation } from "@/navigators";
import { TouchableOpacity, View } from "react-native";
import { cn } from "@/lib/utils";
import { Text } from "@/components";

export const LanguageScreen = () => {
  const navigation = useAppNavigation<"Language">();
  const { i18n, t } = useTranslation("language");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("title"),
    });
  });
  return (
    <View className="gap-4 p-5">
      {[SupportedLngs.vi, SupportedLngs.en].map((lng) => (
        <TouchableOpacity
          key={lng}
          className={cn("rounded-md border border-input p-4", {
            "bg-primary/10": i18n.language === lng,
          })}
          onPress={() => i18n.changeLanguage(lng)}
        >
          <Text>{lng.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
