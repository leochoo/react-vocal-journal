import React, { useEffect, useState } from "react";
import {
  createStyles,
  Container,
  Grid,
  Text,
  Title,
  SimpleGrid,
  TextInput,
  Textarea,
  Button,
  Group,
  ActionIcon,
  Avatar,
  Select,
  NumberInput,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  Slider,
  InputWrapper,
  Center,
  SegmentedControl,
  Box,
} from "@mantine/core";
import { DropzoneButton } from "../components/Dropzone";
import { Record } from "../components/Record";
import { Microphone, Upload } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 400,
    boxSizing: "border-box",
    backgroundImage: `linear-gradient(-60deg, ${
      theme.colors[theme.primaryColor][4]
    } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl * 2.5,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: theme.spacing.xl * 1.5,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.white,
    lineHeight: 1,
  },

  description: {
    color: theme.colors[theme.primaryColor][0],
    maxWidth: 300,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  form: {
    backgroundColor: theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
  },

  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    "&::placeholder": {
      color: theme.colors.gray[5],
    },
  },
  radioGroup: {
    marginBottom: theme.spacing.md,
  },

  inputLabel: {
    color: theme.black,
  },

  temporary: {
    backgroundColor: theme.colors.cyan[6],
  },

  control: {
    backgroundColor: theme.colors.blue[6],
  },

  toggleSwitch: {
    color: theme.colors.green[0],
  },
}));

const NewRecordingPage = () => {
  const { classes } = useStyles();
  const [user, loading, error] = useAuthState(auth); // TODO: make this into redux or context?
  const [submitType, setSubmitType] = useState("record");
  const [audioFile, setAudioFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // slider value - cannot be linked directly to form so not using it now
  // const [sliderValue, setSliderValue] = useState(0);

  const form = useForm({
    initialValues: {
      vowel: undefined,
      pitch: undefined,
      condition: undefined,
      note: "",
    },
    validate: {
      vowel: (value) => (value ? undefined : "Vowel is required"),
      pitch: (value) => (value ? undefined : "Pitch is required"),
      condition: (value) => (value ? undefined : "Condition is required"),
    },
  });

  // upload audio to Firebase storage and get download url
  async function upload(audioFile) {
    const storageRef = ref(
      storage,
      "audio/" + user.uid + "/" + Date.now().toString()
    );
    const metadata = {
      contentType: "audio/wav",
    };
    const uploadTask = uploadBytesResumable(storageRef, audioFile, metadata);
    // 'file' comes from the Blob or File API
    // uploadBytes(storageRef, newAudio).then((snapshot) => {
    //   console.log("Uploaded a blob or file!");
    //   uploadStatus = "Uploaded the audio!";
    // });

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            setUploadStatus("Upload paused ⏸");

            break;
          case "running":
            console.log("Upload is running");
            setUploadStatus("Uploading audio... 🚚");

            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        setUploadStatus("Error uploading 🤕");
      },
      () => {
        // Handle successful uploads on complete
        setUploadStatus("Upload successful! ✅");

        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          // upload to audios collection in firestore
          saveURL(downloadURL);
        });
      }
    );
  }

  async function saveURL(downloadURL) {
    const currTime = Date.now();

    triggerCloudFunction(currTime, downloadURL);

    // clear form and audio
    // below is ran but the UI doesn't change.
    // perhaps that needs a re-render.
    form.reset();
    console.log("form reset", form.values);
    setAudioFile(null);

    // local testing
    // triggerLocalFunction(downloadURL);
  }

  async function triggerCloudFunction(currTime, downloadURL) {
    console.log("CLOUD triggered");
    const url =
      "https://asia-northeast1-vocal-journal.cloudfunctions.net/parselmouth";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        createdAt: currTime,
        updatedAt: currTime, // TODO: need to fix later
        audioURL: downloadURL,
        uid: user.uid,
        displayName: user.displayName,
        vowel: form.values.vowel,
        pitch: form.values.pitch,
        condition: form.values.condition,
        note: form.values.note,
      }),
    });
    // console.log(response);
    const data = await response.json();
    // const data = await response.body.values;
    console.log("CLOUD data: ", data);
  }

  // TODO: send this to the backend so it creates the doc with the analyzed value
  async function submitNewRecording(audioFile) {
    if (audioFile) {
      console.log("New Recording Submission", form.values);
      console.log(form.values);
      // const innerAnalysisRef = collection(db, "users", user.uid, "analysis");
      // await setDoc(doc(innerAnalysisRef), {
      //   ...form.values,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // });
      // upload blob to storage
      await upload(audioFile);

      // TODO: why is this not executed when declared here?
      // clear form and audio
      // form.reset();
      // console.log("form reset", form.values);
      // setAudioFile(null);
    } else {
      alert("no audio file!");
    }
  }

  const handleSubmit = () => {
    submitNewRecording(audioFile);
  };

  // 一時保存
  const temporarySave = async () => {
    console.log("temporary saving");
  };

  useEffect(() => {
    console.log("Audio File", audioFile);
  }, [audioFile]);

  return (
    <div className={classes.wrapper}>
      <div>
        <Title className={classes.title}>New Recording</Title>
        <Text className={classes.description} mt="sm" mb={30}>
          Create or upload a new recording.
        </Text>
      </div>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid grow>
          <Grid.Col md={12} lg={6}>
            <div className={classes.form}>
              <RadioGroup
                label="Vowel"
                required
                style={{ marginTop: 10 }}
                classNames={{
                  label: classes.inputLabel,
                }}
                {...form.getInputProps("vowel")}
              >
                <Radio value="a" label="a" />
                {/* <Radio value="e" label="e" /> */}
                <Radio value="i" label="i" />
                {/* <Radio value="o" label="o" /> */}
                <Radio value="u" label="u" />
              </RadioGroup>

              <RadioGroup
                label="Pitch"
                required
                style={{ marginTop: 10 }}
                classNames={{ label: classes.inputLabel }}
                {...form.getInputProps("pitch")}
              >
                <Radio value="low" label="Low" />
                <Radio value="mid" label="Mid" />
                <Radio value="high" label="High" />
              </RadioGroup>

              <RadioGroup
                label="Condition"
                required
                style={{ marginTop: 10 }}
                classNames={{ label: classes.inputLabel }}
                {...form.getInputProps("condition")}
              >
                <Radio value="bad" label="Bad" />
                <Radio value="mediocre" label="Mediocre" />
                <Radio value="okay" label="Okay" />
                <Radio value="good" label="Good" />
                <Radio value="great" label="Great" />
              </RadioGroup>

              {/* <InputWrapper
                
                classNames={{ label: classes.inputLabel }}
                style={{ marginBottom: 30 }}
                required
                {...form.getInputProps("condition")}
              >
                <Slider
                  label={null}
                  color="red"
                  step={25}
                  marks={[
                    { value: 0, label: "Bad" },
                    { value: 25, label: "So-so" },
                    { value: 50, label: "Okay" },
                    { value: 75, label: "Good" },
                    { value: 100, label: "Great" },
                  ]}
                  value={sliderValue}
                  onChange={(value) => setSliderValue(value)}
                />
              </InputWrapper> */}

              <Textarea
                label="Note"
                placeholder="Notes"
                minRows={4}
                mt="md"
                classNames={{ input: classes.input, label: classes.inputLabel }}
                {...form.getInputProps("note")}
              />
            </div>
          </Grid.Col>
          <Grid.Col md={12} lg={6}>
            <Group position="center" mt="md">
              <SegmentedControl
                color="orange"
                value={submitType}
                onChange={setSubmitType}
                data={[
                  {
                    value: "record",
                    label: (
                      <Center>
                        <Microphone size={16} />
                        <Box ml={10}>録音 Record</Box>
                      </Center>
                    ),
                  },
                  {
                    value: "upload",
                    label: (
                      <Center>
                        <Upload size={16} />
                        <Box ml={10}>アップロード Upload</Box>
                      </Center>
                    ),
                  },
                ]}
              />
              {submitType == "upload" ? (
                <DropzoneButton onFileAttachment={setAudioFile} />
              ) : (
                <Record onFileAttachment={setAudioFile} />
              )}
            </Group>

            <Group position="right" mt="md">
              {/* <Button className={classes.temporary} onClick={temporarySave}>
                一時保存
              </Button> */}
              <Button type="submit" className={classes.control}>
                Submit
              </Button>
            </Group>
            {uploadStatus}
          </Grid.Col>
        </Grid>
      </form>
    </div>
  );
};

export default NewRecordingPage;
