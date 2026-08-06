import "../global.css";
import "@/utils/Logger";
import "@/i18n";

import { createStaticNavigation } from "@react-navigation/native";
import { AppStack } from "@/navigators/AppStack";
import { Provider } from "react-redux";
import { persistor, signIn, store } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { LoaderProvider } from "@baont97/rn-loader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { delay, secureStorage, StorageKeys } from "@/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { useNavigationTheme } from "@/hooks";
import { PortalHost } from "@rn-primitives/portal";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { typography } from "./theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { useQueryClient } from "./hooks";

import BootSplash from "react-native-bootsplash";

export const App = () => {
  const queryClient = useQueryClient();

  const boostrapAsync = async () => {
    // Retrieve token from secure storage
    const token = await secureStorage.getItem(StorageKeys.token);

    if (token) {
      // Update store
      store.dispatch(signIn({ token }));
    }
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <LoaderProvider>
          <Provider store={store}>
            <PersistGate persistor={persistor} onBeforeLift={boostrapAsync}>
              <ThemedNavigation />
            </PersistGate>
          </Provider>
        </LoaderProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};

const RootNavigation = createStaticNavigation(AppStack);

const ThemedNavigation = () => {
  const { theme, colorScheme } = useNavigationTheme();

  return (
    <GestureHandlerRootView className="flex-1">
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
        <RootNavigation
          theme={theme}
          onReady={() => delay(350).then(() => BootSplash.hide({ fade: true }))}
        />
        <PortalHost />
        <Toaster
          theme={colorScheme}
          richColors
          toastOptions={{
            style: { borderRadius: 8 },
            titleStyle: {
              fontFamily: typography.medium,
              fontWeight: "normal",
            },
          }}
          duration={2000}
          position="bottom-center"
        />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
};
