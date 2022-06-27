import React, { useEffect, useState } from "react";
import {
  Container,
  Text,
  Grid,
  createStyles,
  Center,
  SegmentedControl,
  Box,
  Group,
  Select,
  Accordion,
} from "@mantine/core";
import { useAppSelector } from "../redux/hooks";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  collection,
  addDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  limit,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { selectUid } from "../redux/auth/auth.slice";
import { stringify } from "querystring";
import { Language, Microphone, Microphone2, Upload } from "tabler-icons-react";

interface AnalysisDataProps {
  audioURL: string;
  createdAt: number;
  displayName: string;
  pitch: string;
  vowel: string;
  condition: string;
  hnr: number;
  jitter: number;
  shimmer: number;
  uid: string;
  intensityPlot: string;
  pitchPlot: string;
}

const dataConverter = {
  toFirestore(data: AnalysisDataProps): DocumentData {
    return {
      audioURL: data.audioURL,
      createdAt: data.createdAt,
      displayName: data.displayName,
      pitch: data.pitch,
      vowel: data.vowel,
      condition: data.condition,
      hnr: data.hnr,
      jitter: data.jitter,
      shimmer: data.shimmer,
      uid: data.uid,
      intensityPlot: data.intensityPlot,
      pitchPlot: data.pitchPlot,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): AnalysisDataProps {
    const data = snapshot.data(options)!;
    return {
      audioURL: data.audioURL,
      createdAt: data.createdAt,
      displayName: data.displayName,
      pitch: data.pitch,
      vowel: data.vowel,
      condition: data.condition,
      hnr: data.HNR,
      jitter: data.jitter_local,
      shimmer: data.shimmer_local,
      uid: data.uid,
      intensityPlot: data.intensityPlot,
      pitchPlot: data.pitchPlot,
    };
  },
};

const DashboardPage = () => {
  const [recordingType, setRecordingType] = useState("song");
  const [songTitle, setSongTitle] = useState("");
  const [phrase, setPhrase] = useState("");

  let uid = useAppSelector(selectUid);
  const analysisQuery = query(
    collection(db, "users", uid, "analysis").withConverter(dataConverter)
    // limit(25)
    // orderBy("createdAt")
  );
  const [analysisData] = useCollectionData(analysisQuery);

  useEffect(() => {
    if (analysisData) {
      analysisData.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
      console.log(analysisData);
    }
  }, [analysisData]);

  return (
    <Container size="xl" px="xs">
      <Text style={{ marginBottom: "3vh", fontSize: "2rem" }}>Dashboard</Text>
      <Grid>
        <Grid.Col span={12}>
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
                      <Microphone2 size={16} />
                      <Box ml={10}>歌 Song</Box>
                    </Center>
                  ),
                },
                {
                  value: "vowel",
                  label: (
                    <Center>
                      <Language size={16} />
                      <Box ml={10}>母音 Vowel</Box>
                    </Center>
                  ),
                },
              ]}
            />
          </Group>
        </Grid.Col>
        <Grid.Col span={12}>
          <Select
            required
            searchable
            getCreateLabel={(query) => `+ 追加 ${query}`}
            label="Title"
            placeholder="Pick one"
            onChange={setSongTitle}
            data={[
              { value: "react", label: "React" },
              { value: "ng", label: "Angular" },
              { value: "svelte", label: "Svelte" },
              { value: "vue", label: "Vue" },
            ]}
          />
          <Select
            required
            searchable
            getCreateLabel={(query) => `+ 追加 ${query}`}
            label="Phrase"
            placeholder="Pick one"
            data={[
              { value: "react", label: "React" },
              { value: "ng", label: "Angular" },
              { value: "svelte", label: "Svelte" },
              { value: "vue", label: "Vue" },
            ]}
            onChange={setPhrase}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Accordion multiple>
            <Accordion.Item label="Customization">
              Colors, fonts, shadows and many other parts are customizable to
              fit your design needs
            </Accordion.Item>

            <Accordion.Item label="Flexibility">
              Configure components appearance and behavior with vast amount of
              settings or overwrite any part of component styles
            </Accordion.Item>

            <Accordion.Item label="No annoying focus ring">
              With new :focus-visible pseudo-class focus ring appears only when
              user navigates with keyboard
            </Accordion.Item>
          </Accordion>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="xl">比較</Text>

          <Group position="center">
            <Text size="lg">{songTitle}</Text>
          </Group>

          <Group position="center">
            <Text size="lg">{phrase}</Text>
          </Group>
        </Grid.Col>
        <Grid.Col span={12}>
          <Group position="center"></Group>
        </Grid.Col>
        <Grid.Col span={12}>
          <Group position="center"></Group>
        </Grid.Col>
        <Grid.Col span={12}>
          <Group position="center"></Group>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
