import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userName: "",
  userEmail: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.isLoggedIn = true;
      state.userName = action.payload.userName;
      state.userEmail = action.payload.userEmail;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userName = "";
      state.userEmail = "";
    },
  },
});

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectUserName = (state: RootState) => state.auth.userName;
export const selectUserEmail = (state: RootState) => state.auth.userEmail;

export const authReducer = authSlice.reducer;
export const { setActiveUser, logout } = authSlice.actions;
