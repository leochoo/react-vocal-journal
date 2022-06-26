import React, { useEffect } from "react";
import { Container, Text, Grid, createStyles, Center } from "@mantine/core";
import { useAppSelector } from "../redux/hooks";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  collection,
  addDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  limit,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { selectUid } from "../redux/auth/auth.slice";
import { stringify } from "querystring";

interface AnalysisDataProps {
  audioURL: string;
  createdAt: number;
  displayName: string;
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

const DashboardPage = () => {
  let uid = useAppSelector(selectUid);
  const analysisQuery = query(
    collection(db, "users", uid, "analysis").withConverter(dataConverter)
    // limit(25)
    // orderBy("createdAt")
  );
  const [analysisData] = useCollectionData(analysisQuery);
  console.log(analysisData);

  return (
    <Container size="xl" px="xs">
      <Text style={{ marginBottom: "3vh", fontSize: "2rem" }}>Dashboard</Text>
    </Container>
  );
};

export default DashboardPage;
