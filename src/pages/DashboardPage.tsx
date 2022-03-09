import React from "react";
import { Container, Text, Grid } from "@mantine/core";
import CardSample from "../components/samples/CardSample";
import { RadarChartSample } from "../components/samples/RadarChartSample";
import { LineChartSample } from "../components/samples/LineChartSample";
const DashboardPage = () => {
  return (
    <Container>
      <div>DashboardPage</div>
      <Grid grow>
        <Grid.Col span={4}>
          <CardSample />
        </Grid.Col>
        <Grid.Col span={4}>
          <RadarChartSample />
        </Grid.Col>
        <Grid.Col span={4}>
          <CardSample />
        </Grid.Col>
        <Grid.Col span={4}>
          <LineChartSample />
        </Grid.Col>
        <Grid.Col span={4}>
          <CardSample />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
