import React, { useEffect, useState } from "react";
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  createStyles,
  Center,
  Button,
} from "@mantine/core";
import { GasStation, Gauge, ManualGearbox, Users } from "tabler-icons-react";
import { useReactMediaRecorder } from "react-media-recorder";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  imageSection: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  label: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: -0.25,
    textTransform: "uppercase",
  },

  section: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  icon: {
    marginRight: 5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },
}));

export function Record({ onFileAttachment }) {
  const { classes } = useStyles();
  // store blob onstop
  const recordedFileHandler = (blob) => {
    onFileAttachment(blob);
  };
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: false,
      onStop: (blobUrl, blob) => {
        recordedFileHandler(blob);
      },
    });

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>Record Audio</Card.Section>
      <Group position="apart" mt="md">
        Record vowel /a/ vowel for 2 seconds. Maintain the same pitch until the
        end.
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Center>
          <Group direction="column" position="center" mt="md">
            <div>{status}</div>
            <audio src={mediaBlobUrl} controls />
          </Group>
        </Center>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Center>
          <Group spacing={30}>
            {status !== "recording" && (
              <>
                {!mediaBlobUrl ? (
                  <Button color={"red"} radius={"xl"} onClick={startRecording}>
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    color={"yellow"}
                    radius={"xl"}
                    onClick={startRecording}
                  >
                    Redo Recording
                  </Button>
                )}
              </>
            )}
            {status == "recording" && (
              <Button color={"gray"} onClick={stopRecording}>
                Stop Recording
              </Button>
            )}
          </Group>
        </Center>
      </Card.Section>
    </Card>
  );
}
