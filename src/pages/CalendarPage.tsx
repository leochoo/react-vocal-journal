import { Container, Text, Grid } from "@mantine/core";
import React from "react";
import CardSample from "../components/CardSample";
import WrapperPage from "./WrapperPage";

const CalendarPage = () => {
  return (
    <WrapperPage>
      <Container>
        <Text>CalendarPage</Text>
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
    </WrapperPage>
  );
};

export default CalendarPage;
