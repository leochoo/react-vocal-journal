import {
  configureStore,
  ThunkAction,
  Action,
  createSerializableStateInvariantMiddleware,
} from "@reduxjs/toolkit";
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

const serializable = createSerializableStateInvariantMiddleware({
  ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
});

export const store = configureStore({
  reducer: rootReducer,
  // TODO: figuring out the correct way here https://github.com/reduxjs/redux-toolkit/discussions/2257
  // "(Using plain JS array spreads often loses those types.)https://redux.js.org/usage/usage-with-typescript
  // getDefaultMiddleware is necessary to tell Redux that we want to use the default middlewares.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
  // middleware: [serializable, logger],
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
