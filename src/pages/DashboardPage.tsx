import React from "react";
import { Container, Text, Grid } from "@mantine/core";
import CardSample from "../components/CardSample";
import WrapperPage from "./WrapperPage";
const DashboardPage = () => {
  return (
    <WrapperPage>
      <Container>
        <div>DashboardPage</div>
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

export default DashboardPage;
