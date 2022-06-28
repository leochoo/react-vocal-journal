import React, { useEffect } from "react";
import { Container, Text, Grid, createStyles, Center } from "@mantine/core";
import CardSample from "../components/samples/CardSample";
import { RadarChartSample } from "../components/samples/RadarChartSample";
import { LineChartSample } from "../components/samples/LineChartSample";
import { StatsRingCard } from "../components/samples/StatsRingCard";
import { TableReviews } from "../components/samples/TableReviews";
import { LineChart } from "../components/LineChart";
import { CardGradient } from "../components/samples/CardGradient";
import { Stats } from "fs";
import { StatsControls } from "../components/samples/StatsControls";
import { StatsGridIcons } from "../components/samples/StatsGridIcons";
import { create } from "domain";
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

// Vocal Acoustic Analysis - Jitter, Shimmer and HNR Parameters
// João Paulo Teixeira*, Carla Oliveira, Carla Lopes
const jitterDescription = {
  title: "Pitch Stability (Jitter)",
  description:
    "Jitter is defined as the parameter of frequency variation from cycle to cycle. Lower jitter means the pitch is stable.",
};

const shimmerDescription = {
  title: "Volume Stability (Shimmer)",
  description:
    "Shimmer (local, dB): Represents the average absolute difference of the base 10 logarithm of the difference  between two consecutive periods and it is call ShdB. The limit to detect pathologies is 0.350 dB.",
};

const hnrDescription = {
  title: "Harmonics to Noise Ratio (HNR)",
  description:
    "Harmonic to Noise Ratio (HNR) measures the ratio between periodic and non-periodic components of a speech sound. It has become more and more important in the vocal acoustic analysis to diagnose pathologic voices.",
};

const useStyles = createStyles((theme) => ({
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // boxShadow: "0px 0px 10px palegreen",
  },
  chart: {
    position: "relative",
    margin: "auto",
    width: "35vw",
    height: "45vh",
  },
}));
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
  // const analysisData = null;
  // or put the collections under each user

  const { classes } = useStyles();
  return (
    <Container size="xl" px="xs">
      <Text style={{ marginBottom: "3vh", fontSize: "2rem" }}>Dashboard</Text>
      {/* <StatsGridIcons {...statsGridData} /> */}
      {analysisData && (
        <>
          {/* <StatsControls
            data={analysisData.map((data) => ({
              createdAt: data.createdAt,
              jitter: data.jitter,
              shimmer: data.shimmer,
              hnr: data.hnr,
            }))}
          /> */}
          <TableReviews data={analysisData} />
          <Grid>
            <Grid.Col className={classes.card} style={{}} sm={12} lg={4}>
              <CardGradient {...jitterDescription} />
            </Grid.Col>
            <Grid.Col className={classes.chart} sm={12} lg={8}>
              <LineChart
                titleText={"Jitter"}
                data={analysisData.map((data) => ({
                  x: data.createdAt,
                  y: data.jitter,
                }))}
              />
            </Grid.Col>
            <Grid.Col className={classes.chart} sm={12} lg={6}>
              <LineChart
                titleText={"/a/"}
                data={analysisData
                  .filter((x) => x.vowel == "a")
                  .map((data) => ({
                    x: data.createdAt,
                    y: data.hnr,
                  }))}
              />
            </Grid.Col>
            <Grid.Col className={classes.chart} sm={12} lg={6}>
              <LineChart
                titleText={"/i/"}
                data={analysisData
                  .filter((x) => x.vowel == "i")
                  .map((data) => ({
                    x: data.createdAt,
                    y: data.hnr,
                  }))}
              />
            </Grid.Col>
            <Grid.Col className={classes.card} sm={12} lg={4}>
              <CardGradient {...shimmerDescription} />
            </Grid.Col>
            <Grid.Col className={classes.chart} sm={12} lg={8}>
              <LineChart
                titleText={"Shimmer"}
                data={analysisData.map((data) => ({
                  x: data.createdAt,
                  y: data.shimmer,
                }))}
              />
            </Grid.Col>

            <Grid.Col className={classes.card} sm={12} lg={4}>
              <CardGradient {...hnrDescription} />
            </Grid.Col>
            <Grid.Col className={classes.chart} sm={12} lg={8}>
              <LineChart
                titleText={"HNR"}
                data={analysisData.map((data) => ({
                  x: data.createdAt,
                  y: data.hnr,
                }))}
              />
            </Grid.Col>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;
