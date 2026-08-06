import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { api, TUser } from "@/services";
import { RootState } from "../Store";
import { reduxSecureStorage, secureStorage, StorageKeys } from "@/utils";

export const authSliceKey = "auth";

type AuthState = {
  signedIn: boolean;
  user?: TUser;
};

const initialState: AuthState = {
  signedIn: false,
  user: undefined,
};

export const authSlice = createSlice({
  name: authSliceKey,
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      state.signedIn = true;
      secureStorage.setItem(StorageKeys.token, token);
      api.injectToken(token);
    },
    signOut: (state) => {
      state.signedIn = false;
      secureStorage.removeItem(StorageKeys.token);
      api.ejectToken();
    },
    setUser: (state, action: PayloadAction<{ user: TUser }>) => {
      const { user } = action.payload;
      state.user = user;
    },
  },
});

export const { signIn, signOut, setUser } = authSlice.actions;

export const selectIsSignedIn = (state: RootState) => state.auth.signedIn;
export const selectCurrentUser = (state: RootState) => state.auth.user;

// Configure Redux-persist
export default persistReducer<AuthState>(
  {
    key: authSliceKey,
    storage: reduxSecureStorage,
    blacklist: ["isLoading", "error"], // Don't persist loading state or errors
  },
  authSlice.reducer
);
