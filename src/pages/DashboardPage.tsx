import React from "react";
import { Container, Text, Grid } from "@mantine/core";
import CardSample from "../components/samples/CardSample";
import { RadarChartSample } from "../components/samples/RadarChartSample";
import { LineChartSample } from "../components/samples/LineChartSample";
const DashboardPage = () => {
  return (
    <Container>
      <Text size="xl">CalendarPage</Text>

      <Grid grow>
        <Grid.Col sm={12} md={6} lg={3}>
          <CardSample />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={3}>
          <RadarChartSample />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={3}>
          <CardSample />
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={3}>
          <LineChartSample />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
