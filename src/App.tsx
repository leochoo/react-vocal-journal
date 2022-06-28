import React, { useEffect, useMemo, useState } from "react";
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
import { auth, db } from "../firebase";
import { selectIsLoggedIn, selectUid } from "./redux/auth/auth.slice";
import { useAppSelector } from "./redux/hooks";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import {
  collection,
  DocumentData,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const DataContext = React.createContext<AnalysisDataProps[]>([]);

interface AnalysisDataProps {
  audioURL: string;
  createdAt: number;
  displayName: string;
  title: string;
  phrase: string;
  pitch: string;
  vowel: string;
  condition: string;
  hnr: number;
  jitter: number;
  shimmer: number;
  uid: string;
  intensityPlot: string;
  pitchPlot: string;
}

const dataConverter = {
  toFirestore(data: AnalysisDataProps): DocumentData {
    return {
      audioURL: data.audioURL,
      createdAt: data.createdAt,
      displayName: data.displayName,
      title: data.title,
      phrase: data.phrase,
      pitch: data.pitch,
      vowel: data.vowel,
      condition: data.condition,
      hnr: data.hnr,
      jitter: data.jitter,
      shimmer: data.shimmer,
      uid: data.uid,
      intensityPlot: data.intensityPlot,
      pitchPlot: data.pitchPlot,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): AnalysisDataProps {
    const data = snapshot.data(options)!;
    return {
      audioURL: data.audioURL,
      createdAt: data.createdAt,
      displayName: data.displayName,
      title: data.title,
      phrase: data.phrase,
      pitch: data.pitch,
      vowel: data.vowel,
      condition: data.condition,
      hnr: data.HNR,
      jitter: data.jitter_local,
      shimmer: data.shimmer_local,
      uid: data.uid,
      intensityPlot: data.intensityPlot,
      pitchPlot: data.pitchPlot,
    };
  },
};

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState<AnalysisDataProps>();
  let uid = useAppSelector(selectUid);
  const analysisQuery = query(
    collection(db, "users", uid, "analysis").withConverter(dataConverter)
    // limit(25)
    // orderBy("createdAt")
  );
  const [analysisData] = useCollectionData(analysisQuery);

  return (
    // <WrapperPage>
    <>
      <DataContext.Provider value={analysisData}>
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
      </DataContext.Provider>
    </>
    // </WrapperPage>
  );
}

export default App;
