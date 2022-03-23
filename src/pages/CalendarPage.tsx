import { Container, Text, Grid, Center } from "@mantine/core";
import React from "react";
import RangeCalendarSample from "../components/samples/RangeCalendarSample";
import CardSample from "../components/samples/CardSample";
import TableSample from "../components/samples/TableSample";
import { UnderConstructionPage } from "./UnderConstructionPage";
const CalendarPage = () => {
  return (
    <>
      <UnderConstructionPage></UnderConstructionPage>
      {/* <Container size="xl" px="xs">
      <Text style={{ marginBottom: "3vh", fontSize: "2rem" }}>Calendar</Text>
      <Center>
        <RangeCalendarSample />
      </Center>
      <Grid grow>
        <Grid.Col span={4}></Grid.Col>
        <Grid.Col span={4}></Grid.Col>
        <Grid.Col span={4}></Grid.Col>
        <Grid.Col span={4}></Grid.Col>
        <Grid.Col span={4}></Grid.Col>
      </Grid>
    </Container> */}
    </>
  );
};

export default CalendarPage;
