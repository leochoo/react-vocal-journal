import React from "react";
import { Container, Text, Grid, createStyles } from "@mantine/core";
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

const data = [
  {
    datetime: "1/31/22, 12:21:04 PM",
    name: "Leo Choo",
    jitter: 1.2305,
    shimmer: 0.1695,
    hnr: 9.047,
    reviews: {
      positive: 1000,
      negative: 500,
    },
  },
  {
    datetime: "1/14/22, 1:29:56 PM",
    name: "Leo Choo",
    jitter: 0.3946,
    shimmer: 0.02544,
    hnr: 20.906188,
    reviews: {
      positive: 1800,
      negative: 400,
    },
  },
  {
    datetime: "1/4/22, 6:08:32 PM",
    name: "Leo Choo",
    jitter: 0.13931,
    shimmer: 0.034156,
    hnr: 27.81301,
    reviews: {
      positive: 2223,
      negative: 259,
    },
  },
];

const datetime_list = data.map((item) => item.datetime);
const jitter_list = data.map((item) => item.jitter);
const shimmer_list = data.map((item) => item.shimmer);
const hnr_list = data.map((item) => item.hnr);

const statsGridData = {
  data: [
    {
      title: "Revenue",
      value: "$13,456",
      diff: 34,
    },
    {
      title: "Profit",
      value: "$4,145",
      diff: -13,
    },
    {
      title: "Coupons usage",
      value: "745",
      diff: 18,
    },
  ],
};

const DashboardPage = () => {
  return (
    <Container size="xl" px="xs">
      <Text style={{ marginBottom: "3vh", fontSize: "2rem" }}>Dashboard</Text>
      <StatsGridIcons {...statsGridData} />
      <StatsControls />
      <TableReviews data={data} />

      <Grid grow>
        <Grid.Col sm={12} lg={4}>
          <CardGradient {...jitterDescription} />
        </Grid.Col>
        <Grid.Col
          sm={12}
          lg={8}
          style={{
            position: "relative",
            margin: "auto",
            width: "35vw",
            height: "45vh",
          }}
        >
          <LineChart
            titleText={"Jitter"}
            datetime={datetime_list}
            dataset={jitter_list}
          />
        </Grid.Col>
        <Grid.Col sm={12} lg={4}>
          <CardGradient {...shimmerDescription} />
        </Grid.Col>

        <Grid.Col
          sm={12}
          lg={8}
          style={{
            position: "relative",
            margin: "auto",
            width: "35vw",
            height: "45vh",
          }}
        >
          <LineChart
            titleText={"Shimmer"}
            datetime={datetime_list}
            dataset={shimmer_list}
          />
        </Grid.Col>
        <Grid.Col sm={12} lg={4}>
          <CardGradient {...hnrDescription} />
        </Grid.Col>
        <Grid.Col
          sm={12}
          lg={8}
          style={{
            position: "relative",
            margin: "auto",
            width: "35vw",
            height: "45vh",
          }}
        >
          <LineChart
            titleText={"HNR"}
            datetime={datetime_list}
            dataset={hnr_list}
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
