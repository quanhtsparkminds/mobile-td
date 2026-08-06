import { useAppSelector } from "@/hooks";
import {
  CountdownScreen,
  ForgotPasswordScreen,
  LanguageScreen,
  PincodeScreen,
  ProductDetailsScreen,
  SignInScreen,
  SignUpScreen,
} from "@/screens";
import { selectIsSignedIn } from "@/store";
import { StaticParamList, useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

const useIsSignedIn = () => useAppSelector(selectIsSignedIn);
const useIsSignedOut = () => !useAppSelector(selectIsSignedIn);

export const AppStack = createNativeStackNavigator({
  screenOptions: ({ theme }) => ({
    headerStyle: {
      backgroundColor: theme.colors.background,
    },
    headerBackImageSource: undefined,
    headerShadowVisible: false,
    headerBackButtonDisplayMode: "minimal",
    headerTitleAlign: "center",
  }),
  groups: {
    SignedIn: {
      if: useIsSignedIn,
      screens: {
        Home: {
          screen: ProductDetailsScreen,
        },
      },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: {
        SignIn: SignInScreen,
        SignUp: SignUpScreen,
        ForgotPassword: ForgotPasswordScreen,
      },
    },
  },
  screens: {
    Language: LanguageScreen,
    ProductDetails: ProductDetailsScreen,
    Pincode: PincodeScreen,
    Countdown: CountdownScreen,
  },
});

export type AppStackParamList = StaticParamList<typeof AppStack>;

export type AppStackNavigationProps<T extends keyof AppStackParamList> =
  NativeStackNavigationProp<AppStackParamList, T>;

export function useAppNavigation<T extends keyof AppStackParamList>() {
  return useNavigation<AppStackNavigationProps<T>>();
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}
