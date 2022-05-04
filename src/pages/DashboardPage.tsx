import React from "react";
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
  hnr: number;
  jitter: number;
  shimmer: number;
  uid: string;
}

const dataConverter = {
  toFirestore(data: AnalysisDataProps): DocumentData {
    return {
      audioURL: data.audioURL,
      createdAt: data.createdAt,
      displayName: data.displayName,
      hnr: data.hnr,
      jitter: data.jitter,
      shimmer: data.shimmer,
      uid: data.uid,
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
      hnr: data.HNR,
      jitter: data.jitter_local,
      shimmer: data.shimmer_local,
      uid: data.uid,
    };
  },
};

const DashboardPage = () => {
  let uid = useAppSelector(selectUid);
  const analysisQuery = query(
    collection(db, "analysis").withConverter(dataConverter),
    where("uid", "==", uid)
    // orderBy("createdAt", "desc")
  );
  const [analysisData] = useCollectionData(analysisQuery);
  console.log("analysisData", analysisData);

  // const datetime_list = analysisData.map((item) => item.createdAt);
  // const jitter_list = analysisData.map((item) => item.jitter);
  // const shimmer_list = analysisData.map((item) => item.shimmer);
  // const hnr_list = analysisData.map((item) => item.hnr);

  const { classes } = useStyles();
  return (
    <Container size="xl" px="xs">
      <Text style={{ marginBottom: "3vh", fontSize: "2rem" }}>Dashboard</Text>
      <StatsControls />
      {/* <StatsGridIcons {...statsGridData} /> */}
      {analysisData && <TableReviews data={analysisData} />}

      {/* <Grid>
        <Grid.Col className={classes.card} style={{}} sm={12} lg={4}>
          <CardGradient {...jitterDescription} />
        </Grid.Col>
        <Grid.Col className={classes.chart} sm={12} lg={8}>
          <LineChart
            titleText={"Jitter"}
            datetime={datetime_list}
            dataset={jitter_list}
          />
        </Grid.Col>

        <Grid.Col className={classes.card} sm={12} lg={4}>
          <CardGradient {...shimmerDescription} />
        </Grid.Col>
        <Grid.Col className={classes.chart} sm={12} lg={8}>
          <LineChart
            titleText={"Shimmer"}
            datetime={datetime_list}
            dataset={shimmer_list}
          />
        </Grid.Col>

        <Grid.Col className={classes.card} sm={12} lg={4}>
          <CardGradient {...hnrDescription} />
        </Grid.Col>
        <Grid.Col className={classes.chart} sm={12} lg={8}>
          <LineChart
            titleText={"HNR"}
            datetime={datetime_list}
            dataset={hnr_list}
          />
        </Grid.Col>
      </Grid> */}
    </Container>
  );
};

export default DashboardPage;
