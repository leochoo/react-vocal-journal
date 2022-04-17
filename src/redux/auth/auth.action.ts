import { createAsyncThunk } from "@reduxjs/toolkit";
import { customAxios } from "../../utils/axios";
import { validateResponse } from "../action.helpers";
import { LoginCredentials } from "./auth.types";

export const login = createAsyncThunk<void, LoginCredentials>(
  "login",
  async (loginCredentials) => {
    const response = await customAxios.post("/auth/login", loginCredentials);
    validateResponse(response, ["payload.token"]);

    const { token } = response.data.payload;
    localStorage.setItem("jwt", token);
    customAxios.updateToken(token);
  }
);
