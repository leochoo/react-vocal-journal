import React, { useEffect, useRef } from "react";
import {
  Text,
  Group,
  Button,
  createStyles,
  MantineTheme,
  useMantineTheme,
} from "@mantine/core";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import { CloudUpload } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginBottom: 30,
    marginTop: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    backgroundColor: theme.colors.orange[5],
    position: "absolute",
    width: 250,
    left: "calc(50% - 125px)",
    // bottom: 20,
  },
}));

function getActiveColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.black;
}

export function DropzoneButton({ onFileAttachment }) {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const openRef = useRef<() => void>(() => {});
  const uploadedFileHandler = (file) => {
    onFileAttachment(file);
  };

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={(file) => uploadedFileHandler(file)}
        onReject={(file) => console.log("rejected files", file)}
        className={classes.dropzone}
        radius="md"
        accept={[".wav", ".mp3", ".m4a"]}
        maxSize={30 * 1024 ** 2}
        multiple={false}
      >
        {(status) => (
          <div style={{ pointerEvents: "none" }}>
            <Group position="center">
              <CloudUpload size={50} color={getActiveColor(status, theme)} />
            </Group>
            <Text
              align="center"
              weight={700}
              size="lg"
              mt="xl"
              sx={{ color: getActiveColor(status, theme) }}
            >
              {status.accepted
                ? "Drop files here"
                : status.rejected
                ? ".wav, .mp3, .m4a file less than 30mb"
                : "Upload audio"}
            </Text>
            <Text align="center" size="sm" mt="xs" color="dimmed">
              Drag&apos;n&apos;drop files here to upload. We can accept only{" "}
              <i>wav, .mp3, .m4a</i> files that are less than 10mb in size.
            </Text>

            <Button
              className={classes.control}
              size="md"
              radius="xl"
              onClick={() => openRef.current()}
            >
              Select files
            </Button>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
