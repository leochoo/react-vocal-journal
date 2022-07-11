import React, { useEffect, useState, useContext } from "react";
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
  RadioGroup,
  Radio,
  Image,
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
import {
  ArrowDown,
  ArrowUp,
  Language,
  Microphone,
  Microphone2,
  Upload,
} from "tabler-icons-react";
import dayjs from "dayjs";
import { RadarChartSample } from "../components/samples/RadarChartSample";
import { BarChart } from "../components/samples/BarChart";

import DownloadLink from "react-download-link";
import { saveAs } from "file-saver";

import { DataContext } from "../pages/WrapperPage";

interface AnalysisDataProps {
  audioURL: string;
  createdAt: number;
  displayName: string;
  title: string;
  phrase: string;
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

const DashboardPage = () => {
  const [recordingType, setRecordingType] = useState("song");
  const [songTitle, setSongTitle] = useState("");
  const [phrase, setPhrase] = useState("");
  const [vowel, setVowel] = useState("");
  const [pitch, setPitch] = useState("");

  const [sortedData, setSortedData] = useState<AnalysisDataProps[]>([]);
  const [mostRecent, setMostRecent] = useState<AnalysisDataProps>();
  const [initial, setInitial] = useState<AnalysisDataProps>();
  const [filteredData, setFilteredData] = useState<AnalysisDataProps[]>([]);

  const [songTitleList, setSongTitleList] = useState<string[]>([]);
  const [phraseList, setPhraseList] = useState<string[]>([]);

  const analysisData = useContext(DataContext);

  // get all unique values of songTitleList and phraseList inside SortedData
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

  useEffect(() => {
    // sort analysisData and store in SortedData
    // TODO: refactor this to be more efficient
    if (analysisData) {
      const sorted = analysisData.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });

      const filtered = sorted.filter((data) => {
        if (recordingType === "song") {
          return (
            data.title === songTitle &&
            data.title !== "" &&
            data.phrase === phrase &&
            data.phrase !== ""
          );
        } else if (recordingType === "vowel") {
          return (
            data.vowel === vowel &&
            data.vowel !== "" &&
            data.pitch === pitch &&
            data.pitch !== ""
          );
        }
      });

      setSortedData(sorted);
      setFilteredData(filtered);
      setMostRecent(filtered[0]);
      setInitial(filtered[filtered.length - 1]);
    }
  }, [analysisData, recordingType, songTitle, phrase, vowel, pitch]);

  useEffect(() => {
    console.log("mostRecent", mostRecent);
    console.log("initial", initial);
    console.log("Sorted Data:", sortedData);
    console.log("Filtered Data", filteredData);
  }, [mostRecent, initial, sortedData]);

  const formatDate = (createdAt: number) => {
    return dayjs(createdAt).format("YYYY/MM/DD HH:mm:ss");
  };

  const progressDisplay = (
    parameter: string,
    before: number,
    after: number
  ) => {
    // take mostRecent and initial of jitter, shimmer, and hnr, and return the percentage of change.
    // for jitter and shimmer, if percentage of change is negative, return green. else red.
    // for HNR, if percetnage of change is positive, return green. else red
    let change = (after - before) / before;
    let percentage = Math.round(change * 100);
    if (parameter === "jitter" || parameter === "shimmer") {
      if (percentage < 0) {
        return (
          <Text color="green">
            {percentage}% <ArrowDown />
          </Text>
        );
      } else {
        return (
          <Text color="red">
            {percentage}% <ArrowUp />
          </Text>
        );
      }
    }
    if (parameter === "hnr") {
      if (percentage > 0) {
        return (
          <Text color="green">
            {percentage}% <ArrowUp />
          </Text>
        );
      } else {
        return (
          <Text color="red">
            {percentage}% <ArrowDown />
          </Text>
        );
      }
    }
  };

  const saveFile = () => {
    saveAs(
      // "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      "https://storage.googleapis.com/vocal-journal/images/1656404760303_pitch.png",
      "singing.png"
    );
  };

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
          {recordingType == "song" ? (
            <>
              <Select
                required
                searchable
                label="Title"
                placeholder="Pick one"
                // convert songTitleList to select data fields
                data={songTitleList.map((title) => {
                  return { value: title, label: title };
                })}
                onChange={setSongTitle}
              />
              <Select
                required
                searchable
                label="Phrase"
                placeholder="Pick one"
                data={phraseList.map((phrase) => {
                  return { value: phrase, label: phrase };
                })}
                onChange={setPhrase}
              />
            </>
          ) : (
            <>
              <RadioGroup
                label="Vowel"
                required
                style={{ marginTop: 10 }}
                onChange={setVowel}
              >
                <Radio value="a" label="a" />
                <Radio value="i" label="i" />
                <Radio value="u" label="u" />
              </RadioGroup>

              <RadioGroup
                label="Pitch"
                required
                style={{ marginTop: 10 }}
                onChange={setPitch}
              >
                <Radio value="low" label="Low" />
                <Radio value="mid" label="Mid" />
                <Radio value="high" label="High" />
              </RadioGroup>
            </>
          )}
        </Grid.Col>
        <Grid.Col span={12}>
          {/* <Text size="xl">履歴</Text>
          <Accordion multiple>
            {analysisData?.map((data) => {
              const dataLabel = formatDate(data.createdAt);
              return (
                <Accordion.Item key={data.createdAt} label={dataLabel}>
                  <Box>
                    <Box>
                      <Text>{data.audioURL}</Text>
                      <Text>{data.pitch}</Text>
                      <Text>{data.vowel}</Text>
                      <Text>{data.condition}</Text>
                      <Text>{data.hnr}</Text>
                      <Text>{data.jitter}</Text>
                      <Text>{data.shimmer}</Text>
                      <Text>{data.uid}</Text>
                      <Text>{data.intensityPlot}</Text>
                      <Text>{data.pitchPlot}</Text>
                    </Box>
                  </Box>
                </Accordion.Item>
              );
            })}
          </Accordion> */}
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="xl">Comparison</Text>
          <Group position="center">
            <Text size="lg">
              {recordingType === "song" ? (
                <Text>Title: {songTitle}</Text>
              ) : (
                <Text>Vowel: {vowel}</Text>
              )}
            </Text>
          </Group>
          <Group position="center">
            <Text size="lg">
              {recordingType === "song" ? (
                <Text>Phrase: {phrase}</Text>
              ) : (
                <Text>Pitch: {pitch}</Text>
              )}
            </Text>
          </Group>
        </Grid.Col>

        {filteredData && filteredData.length > 1 ? (
          <Grid>
            <Grid.Col span={12}>
              <Text size="xl">After</Text>
              <Text size="xl">{formatDate(mostRecent.createdAt)}</Text>
              <Group position="center"></Group>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text size="xl">Before</Text>
              <Text size="xl">{formatDate(initial.createdAt)}</Text>
              <Group position="center"></Group>
            </Grid.Col>
            <Grid.Col span={12}>
              {/* <Group position="center">
                <Box style={{ height: "100vw" }}>
                  <RadarChartSample mostRecent={mostRecent} initial={initial} />
                  <BarChart
                    after={mostRecent.jitter}
                    before={initial.jitter}
                  />
                </Box>
              </Group> */}
            </Grid.Col>
            <Grid.Col span={4}>
              <Text size="xl">Jitter</Text>
              <Group position="center">
                {progressDisplay("jitter", initial.jitter, mostRecent.jitter)}
              </Group>
              <Group position="center">After {mostRecent.jitter}</Group>
              <Group position="center">Before {initial.jitter}</Group>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text size="xl">Shimmer</Text>
              <Group position="center">
                {progressDisplay(
                  "shimmer",
                  initial.shimmer,
                  mostRecent.shimmer
                )}
              </Group>
              <Group position="center">After {mostRecent.shimmer}</Group>
              <Group position="center">Before {initial.shimmer}</Group>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text size="xl">HNR</Text>
              <Group position="center">
                {progressDisplay("hnr", initial.hnr, mostRecent.hnr)}
              </Group>
              <Group position="center">After {mostRecent.hnr}</Group>
              <Group position="center">Before {initial.hnr}</Group>
            </Grid.Col>

            <Grid.Col span={12}>
              <Text size="xl">Spectrogram</Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text size="lg">Pitch</Text>
            </Grid.Col>

            <Grid.Col span={6}>
              <Group position="center">
                <Text size="lg">Before</Text>
              </Group>
              <Image src={initial.pitchPlot} />
            </Grid.Col>
            <Grid.Col span={6}>
              <Group position="center">
                <Text size="lg">After</Text>
              </Group>
              <Image src={mostRecent.pitchPlot} />
            </Grid.Col>

            <Grid.Col span={12}>
              <Text size="lg">Intensity</Text>
            </Grid.Col>

            <Grid.Col span={6}>
              <Group position="center">
                <Text size="lg">Before</Text>
              </Group>
              <Image src={initial.intensityPlot} />
            </Grid.Col>
            <Grid.Col span={6}>
              <Group position="center">
                <Text size="lg">After</Text>
              </Group>
              <Image src={mostRecent.intensityPlot} />
            </Grid.Col>
          </Grid>
        ) : (
          <Grid.Col span={12}>
            <Group position="center">
              <Text size="md">
                比較を表示するためには履歴が2つ以上必要です。
              </Text>
            </Group>
          </Grid.Col>
        )}
      </Grid>
    </Container>
  );
};

export default DashboardPage;
