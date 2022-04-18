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
import { rootReducer } from "./root.reducer";
import { RootState } from "./root.reducer";

export const store = configureStore({
  reducer: rootReducer,
  // TODO: getDefaultMiddlware: instead of spread operator, use prepend? or append or sth.
  // "(Using plain JS array spreads often loses those types.)https://redux.js.org/usage/usage-with-typescript
  // getDefaultMiddleware is necessary to tell Redux that we want to use the default middlewares.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// export default store;
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
