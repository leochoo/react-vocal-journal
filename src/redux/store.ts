import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { authReducer } from "./auth/auth.slice";
import logger from "redux-logger";

// Combining reducers
const reducer = {
  auth: authReducer,
};

export const store = configureStore({
  reducer,
  // TODO: getDefaultMiddlware: instead of spread operator, use prepend? or append or sth.
  // "(Using plain JS array spreads often loses those types.)https://redux.js.org/usage/usage-with-typescript
  // getDefaultMiddleware is necessary to tell Redux that we want to use the default middlewares.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
