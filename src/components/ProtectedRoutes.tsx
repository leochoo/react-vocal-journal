import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectIsLoggedIn } from "../redux/auth/auth.slice";
import WrapperPage from "../pages/WrapperPage";
export function ProtectedRoute({ children }: { children: JSX.Element }) {
  let location = useLocation();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  console.log("isLoggedIn", isLoggedIn);

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <WrapperPage>{children}</WrapperPage>;
}
