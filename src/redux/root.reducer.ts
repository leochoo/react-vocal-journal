import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { authReducer } from "./auth/auth.slice";
import logger from "redux-logger";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PersistConfig,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/es/storage";

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
};

// Combining reducers
const _rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof _rootReducer>;

export const rootReducer = persistReducer(persistConfig, _rootReducer);
