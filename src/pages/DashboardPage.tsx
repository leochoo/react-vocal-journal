import React from "react";
import { Container, Text, Grid, createStyles } from "@mantine/core";
import CardSample from "../components/samples/CardSample";
import { RadarChartSample } from "../components/samples/RadarChartSample";
import { LineChartSample } from "../components/samples/LineChartSample";
import { StatsRingCard } from "../components/samples/StatsRingCard";
import { TableReviews } from "../components/samples/TableReviews";
import { LineChart } from "../components/LineChart";

const jitter_statsRingCardData = {
  title: "Jitter Practice",
  completed: 81,
  total: 100,
  stats: [
    {
      value: 19,
      label: "Remaining",
    },
    {
      value: 2,
      label: "In progress",
    },
  ],
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

const DashboardPage = () => {
  return (
    <Container size="xl" px="xs">
      <Text style={{ marginBottom: "3vh", fontSize: "2rem" }}>Dashboard</Text>

      <TableReviews data={data} />

      <Grid grow style={{ border: "red solid 1px" }}>
        <Grid.Col style={{ border: "orange solid 1px" }} sm={12} lg={4}>
          <StatsRingCard {...jitter_statsRingCardData} />
        </Grid.Col>
        <Grid.Col
          sm={12}
          lg={8}
          style={{
            position: "relative",
            margin: "auto",
            width: "35vw",
            height: "45vh",
            border: "orange solid 1px",
          }}
        >
          <LineChart
            titleText={"Jitter"}
            datetime={datetime_list}
            dataset={jitter_list}
          />
        </Grid.Col>
        <Grid.Col style={{ border: "orange solid 1px" }} sm={12} lg={4}>
          <StatsRingCard {...jitter_statsRingCardData} />
        </Grid.Col>
        <Grid.Col
          sm={12}
          lg={8}
          style={{
            position: "relative",
            margin: "auto",
            width: "35vw",
            height: "45vh",
            border: "orange solid 1px",
          }}
        >
          <LineChart
            titleText={"Shimmer"}
            datetime={datetime_list}
            dataset={shimmer_list}
          />
        </Grid.Col>
        <Grid.Col style={{ border: "orange solid 1px" }} sm={12} lg={4}>
          <StatsRingCard {...jitter_statsRingCardData} />
        </Grid.Col>
        <Grid.Col
          sm={12}
          lg={8}
          style={{
            position: "relative",
            margin: "auto",
            width: "35vw",
            height: "45vh",
            border: "orange solid 1px",
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
