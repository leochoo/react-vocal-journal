import { useEffect, useMemo, useState } from "react";
import {
  AppShell,
  Burger,
  createStyles,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import {
  CalendarIcon,
  DashboardIcon,
  RadiobuttonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import Sample from "./Sample";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import NewRecordingPage from "./pages/NewRecordingPage";
import ProfilePage from "./pages/ProfilePage";
import WrapperPage from "./pages/WrapperPage";
import LoginPage from "./pages/LoginPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function App() {
  const [user, loading, error] = useAuthState(auth);

  function ProtectedRoute({ children }: { children: JSX.Element }) {
    let location = useLocation();

    if (!user) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <WrapperPage>{children}</WrapperPage>;
  }

  return (
    // <WrapperPage>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/new-recording"
        element={
          <ProtectedRoute>
            <NewRecordingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
    // </WrapperPage>
  );
}

export default App;
