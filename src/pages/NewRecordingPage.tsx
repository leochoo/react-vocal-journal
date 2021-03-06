import React, { useContext, useEffect, useState } from "react";
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
import { UploadPlayer } from "../components/UploadPlayer";
import { DataContext } from "../pages/WrapperPage";

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

  audiofileWrapper: {
    position: "relative",
    marginBottom: 30,
    marginTop: 30,
  },
}));

const NewRecordingPage = () => {
  const { classes } = useStyles();
  const [user, loading, error] = useAuthState(auth); // TODO: make this into redux or context?
  const [recordingType, setRecordingType] = useState("song");
  const [submitType, setSubmitType] = useState("record");
  const [audioFile, setAudioFile] = useState<File[]>(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const analysisData = useContext(DataContext);

  const [songTitleList, setSongTitleList] = useState<string[]>([]);
  const [phraseList, setPhraseList] = useState<string[]>([]);
  useEffect(() => {
    if (analysisData) {
      let songTitleList = [];
      let phraseList = [];
      analysisData.forEach((data) => {
        if (!songTitleList.includes(data.title)) {
          songTitleList.push(data.title);
        }
        if (!phraseList.includes(data.phrase)) {
          phraseList.push(data.phrase);
        }
      });
      setSongTitleList(songTitleList);
      setPhraseList(phraseList);
    }
  }, [analysisData]);

  // slider value - cannot be linked directly to form so not using it now
  // const [sliderValue, setSliderValue] = useState(0);

  const form = useForm({
    initialValues: {
      vowel: undefined,
      pitch: undefined,
      title: undefined,
      phrase: undefined,
      condition: undefined,
      note: "",
    },
    validate: {
      vowel: (value) => {
        if (recordingType === "vowel") {
          value ? undefined : "Vowel is required";
        }
      },
      pitch: (value) => {
        if (recordingType === "vowel") {
          value ? undefined : "Pitch is required";
        }
      },
      title: (value) => {
        if (recordingType === "song") {
          value ? undefined : "Title is required";
        }
      },
      phrase: (value) => {
        if (recordingType === "song") {
          value ? undefined : "Phrase is required";
        }
      },
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
            setUploadStatus("Upload paused ???");

            break;
          case "running":
            console.log("Upload is running");
            setUploadStatus("Uploading audio... ????");

            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        setUploadStatus("Error uploading ????");
      },
      () => {
        // Handle successful uploads on complete
        setUploadStatus("Upload successful! ???");

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

    // local testing
    // triggerLocalFunction(currTime, downloadURL);

    // clear form and audio
    // below is ran but the UI doesn't change.
    // perhaps that needs a re-render.
    form.reset();
    console.log("form reset", form.values);
    setAudioFile(null);
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
        title: form.values.title,
        phrase: form.values.phrase,
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

      // set certain fields as undefined from the form
      if (recordingType === "song") {
        form.values.vowel = "";
        form.values.pitch = "";
      } else if (recordingType === "vowel") {
        form.values.title = "";
        form.values.phrase = "";
      }

      console.log("final form values", form.values);

      // convert audio file to blob
      if (submitType == "upload") {
        audioFile = new Blob(audioFile);
      }

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

  const handleSubmit = (values) => {
    console.log("values: ", values);
    submitNewRecording(audioFile);
  };

  // ????????????
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
      <Group position="center">
        <SegmentedControl
          color="orange"
          value={recordingType}
          onChange={setRecordingType}
          data={[
            {
              value: "song",
              label: (
                <Center>
                  <Microphone size={16} />
                  <Box ml={10}>??? Song</Box>
                </Center>
              ),
            },
            {
              value: "vowel",
              label: (
                <Center>
                  <Upload size={16} />
                  <Box ml={10}>?????? Vowel</Box>
                </Center>
              ),
            },
          ]}
        />
      </Group>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid grow>
          <Grid.Col span={12}></Grid.Col>
          <Grid.Col span={12}>
            <div className={classes.form}>
              {recordingType == "song" ? (
                <>
                  <Select
                    required
                    creatable
                    searchable
                    getCreateLabel={(query) => `+ ?????? ${query}`}
                    onCreate={(query) =>
                      setSongTitleList((current) => [...current, query])
                    }
                    label="Title"
                    placeholder="Pick one"
                    data={songTitleList.map((title) => {
                      return { value: title, label: title };
                    })}
                    {...form.getInputProps("title")}
                  />
                  <Select
                    required
                    creatable
                    searchable
                    getCreateLabel={(query) => `+ ?????? ${query}`}
                    onCreate={(query) =>
                      setPhraseList((current) => [...current, query])
                    }
                    label="Phrase"
                    placeholder="Pick one"
                    data={phraseList.map((phrase) => {
                      return { value: phrase, label: phrase };
                    })}
                    {...form.getInputProps("phrase")}
                  />
                </>
              ) : (
                <>
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
                </>
              )}

              <RadioGroup
                label="Condition"
                required
                style={{ marginTop: 10 }}
                classNames={{ label: classes.inputLabel }}
                {...form.getInputProps("condition")}
              >
                <Radio value="bad" label="??????" />
                <Radio value="mediocre" label="???????????????" />
                <Radio value="okay" label="????????????" />
                <Radio value="good" label="??????" />
                <Radio value="great" label="??????" />
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
          <Grid.Col span={12}>
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
                        <Box ml={10}>?????? Record</Box>
                      </Center>
                    ),
                  },
                  {
                    value: "upload",
                    label: (
                      <Center>
                        <Upload size={16} />
                        <Box ml={10}>?????????????????? Upload</Box>
                      </Center>
                    ),
                  },
                ]}
              />
            </Group>
          </Grid.Col>
          <Grid.Col span={12}>
            <Group position="center" mt="md">
              {submitType == "upload" ? (
                <>
                  {audioFile ? (
                    <UploadPlayer audioFile={audioFile} />
                  ) : (
                    <DropzoneButton onFileAttachment={setAudioFile} />
                  )}
                </>
              ) : (
                <Record onFileAttachment={setAudioFile} />
              )}
            </Group>

            <Group position="center" mt="md">
              {/* <Button className={classes.temporary} onClick={temporarySave}>
                ????????????
              </Button> */}
              <Button type="submit" className={classes.control}>
                ?????? Submit
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
