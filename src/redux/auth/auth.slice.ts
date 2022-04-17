import { createSlice } from "@reduxjs/toolkit";

// import { login } from "./auth.actions";

interface AuthState {
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout() {
      localStorage.clear();
      return initialState;
    },
    setIsLoggedIn: (state) => {
      state.isLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder;
    .addCase(login.pending, createMessageAction("logging in"))
    .addCase(login.fulfilled, (state) => {
      state.isLoggedIn = true;
      redirectAfterTimeout("/reviewer")();
    });
  },
});

export const authReducer = authSlice.reducer;
export const { logout, setIsLoggedIn } = authSlice.actions;
