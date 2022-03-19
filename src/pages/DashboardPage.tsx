import React from "react";
import { Container, Text, Grid, createStyles } from "@mantine/core";
import CardSample from "../components/samples/CardSample";
import { RadarChartSample } from "../components/samples/RadarChartSample";
import { LineChartSample } from "../components/samples/LineChartSample";
import { StatsRingCard } from "../components/samples/StatsRingCard";
import { TableReviews } from "../components/samples/TableReviews";

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
    title: "Jitter",
    author: "Isaac Asimov",
    year: 1951,
    reviews: {
      positive: 2223,
      negative: 259,
    },
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    year: 1818,
    reviews: {
      positive: 5677,
      negative: 1265,
    },
  },
  {
    title: "Solaris",
    author: "Stanislaw Lem",
    year: 1961,
    reviews: {
      positive: 3487,
      negative: 1845,
    },
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    year: 1965,
    reviews: {
      positive: 8576,
      negative: 663,
    },
  },
  {
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    year: 1969,
    reviews: {
      positive: 6631,
      negative: 993,
    },
  },
  {
    title: "A Scanner Darkly",
    author: "Philip K Dick",
    year: 1977,
    reviews: {
      positive: 8124,
      negative: 1847,
    },
  },
];

const DashboardPage = () => {
  return (
    <Container size="xl" px="xs">
      <Text size="xl">Dashboard</Text>

      {/* <TableReviews data={data} /> */}

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
          <LineChartSample />
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
          <LineChartSample />
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
          <LineChartSample />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
