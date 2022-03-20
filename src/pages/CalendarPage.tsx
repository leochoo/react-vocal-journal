import { Container, Text, Grid } from "@mantine/core";
import React from "react";
import CalendarSample from "../components/samples/CalendarSample";
import CardSample from "../components/samples/CardSample";
import TableSample from "../components/samples/TableSample";

const CalendarPage = () => {
  return (
    <Container size="xl" px="xs">
      <Text style={{ marginBottom: "3vh", fontSize: "2rem" }}>Calendar</Text>
      <CalendarSample />
      <TableSample />
      <Grid grow>
        <Grid.Col span={4}>
          <CardSample />
        </Grid.Col>
        <Grid.Col span={4}>
          <CardSample />
        </Grid.Col>
        <Grid.Col span={4}>
          <CardSample />
        </Grid.Col>
        <Grid.Col span={4}>
          <CardSample />
        </Grid.Col>
        <Grid.Col span={4}>
          <CardSample />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default CalendarPage;
