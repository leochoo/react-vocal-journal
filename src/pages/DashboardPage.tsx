import React from "react";
import { Container, Text, Grid } from "@mantine/core";
import CardSample from "../components/samples/CardSample";
import { RadarChartSample } from "../components/samples/RadarChartSample";
import { LineChartSample } from "../components/samples/LineChartSample";
const DashboardPage = () => {
  return (
    <Container size="xl" px="xs">
      <Text size="xl">Dashboard</Text>

      <Grid grow>
        <Grid.Col sm={12} lg={6}>
          <CardSample />
        </Grid.Col>
        <Grid.Col
          sm={12}
          lg={6}
          style={{
            position: "relative",
            margin: "auto",
            width: "35vw",
            height: "60vh",
          }}
        >
          <RadarChartSample />
        </Grid.Col>
        <Grid.Col sm={12} lg={3}>
          <CardSample />
        </Grid.Col>
        <Grid.Col
          sm={12}
          lg={3}
          style={{
            position: "relative",
            margin: "auto",
            width: "35vw",
            height: "60vh",
          }}
        >
          <LineChartSample />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
