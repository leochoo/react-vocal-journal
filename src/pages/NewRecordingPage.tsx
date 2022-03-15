import React from "react";
import { Container, Text, Grid } from "@mantine/core";

import { DropzoneButton } from "../components/Dropzone";

const NewRecordingPage = () => {
  return (
    <Container>
      <Grid grow>
        <Grid.Col md={12} lg={6}>
          <DropzoneButton />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default NewRecordingPage;
