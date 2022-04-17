import { createSlice } from "@reduxjs/toolkit";

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
    setUser: (state, action) => {
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

export const selectIsLoggedIn = (state: AuthState) => state.isLoggedIn;
export const selectUserName = (state: AuthState) => state.userName;
export const selectUserEmail = (state: AuthState) => state.userEmail;

export const authReducer = authSlice.reducer;
export const { setUser, logout } = authSlice.actions;
