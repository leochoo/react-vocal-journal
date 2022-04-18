import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../root.reducer";

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  uid: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userName: "",
  userEmail: "",
  uid: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.isLoggedIn = true;
      state.userName = action.payload.userName;
      state.userEmail = action.payload.userEmail;
      state.uid = action.payload.uid;
    },
    setLoggedOutUser: (state) => {
      state.isLoggedIn = false;
      state.userName = "";
      state.userEmail = "";
      state.uid = "";
    },
  },
});

// maybe i can clean this up using createSelector
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectUserName = (state: RootState) => state.auth.userName;
export const selectUserEmail = (state: RootState) => state.auth.userEmail;
export const selectUid = (state: RootState) => state.auth.uid;

export const authReducer = authSlice.reducer;
export const { setActiveUser, setLoggedOutUser } = authSlice.actions;
