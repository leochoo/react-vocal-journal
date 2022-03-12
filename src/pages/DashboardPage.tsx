import React from "react";
import { Container, Text, Grid } from "@mantine/core";
import CardSample from "../components/samples/CardSample";
import { RadarChartSample } from "../components/samples/RadarChartSample";
import { LineChartSample } from "../components/samples/LineChartSample";
const DashboardPage = () => {
  return (
    <Container>
      <Grid grow>
        <Grid.Col md={6} lg={3}>
          <CardSample />
        </Grid.Col>
        <Grid.Col
          style={{ position: "relative", margin: "auto" }}
          md={6}
          lg={3}
        >
          <RadarChartSample />
        </Grid.Col>
        <Grid.Col md={6} lg={3}>
          <CardSample />
        </Grid.Col>
        <Grid.Col md={6} lg={3}>
          <LineChartSample />
        </Grid.Col>
        <Grid.Col md={6} lg={3}>
          <CardSample />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
