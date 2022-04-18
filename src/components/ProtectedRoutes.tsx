import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectIsLoggedIn } from "../redux/auth/auth.slice";
import WrapperPage from "../pages/WrapperPage";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  let location = useLocation();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  console.log("isLoggedIn", isLoggedIn);

  return isLoggedIn ? (
    <WrapperPage>{children}</WrapperPage>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
