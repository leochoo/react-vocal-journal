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

import { DataContext } from "../App";

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
  const [mostRecent, setMostRecent] = useState<AnalysisDataProps>();
  const [initial, setInitial] = useState<AnalysisDataProps>();
  const [processedData, setProcessedData] = useState<AnalysisDataProps[]>([]);
  const [filteredData, setFilteredData] = useState<AnalysisDataProps[]>([]);
  const [songTitleList, setSongTitleList] = useState<string[]>([]);
  const [phraseList, setPhraseList] = useState<string[]>([]);

  let uid = useAppSelector(selectUid);
  const analysisData = useContext(DataContext);

  // get all unique values of songTitleList and phraseList inside processedData
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

  // if recordingType === "song", filter based on songTitle and phrase
  // if recordingType === "vowel", filter based on vowel and pitch
  // useEffect(() => {
  //   if (analysisData) {
  //     let filtered = analysisData.filter((data) => {
  //       if (recordingType === "song") {
  //         return data.title === songTitle && data.phrase === phrase;
  //       } else if (recordingType === "vowel") {
  //         return data.vowel === vowel && data.pitch === pitch;
  //       }
  //     });
  //     setFilteredData(filtered);
  //     console.log("filtered", filteredData);
  //   }
  // }, [analysisData, recordingType, songTitle, phrase, vowel, pitch]);

  // const getFilteredData = ()

  useEffect(() => {
    // sort analysisData and store in ProcessedData
    // TODO: refactor this to be more efficient
    if (analysisData) {
      // let filtered = analysisData.filter((data) => {
      //   if (recordingType === "song") {
      //     return data.title === songTitle && data.phrase === phrase;
      //   } else if (recordingType === "vowel") {
      //     return data.vowel === vowel && data.pitch === pitch;
      //   }
      // });
      // setFilteredData(filtered);

      const sorted = analysisData.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });

      // when recordingType === "song", filter analysisData, so that data.map => data has title and phrase
      // when recordingType === "vowel", filter analysisData, so that data.map => data has vowel and pitch
      // const filtered = sorted.filter((data) => {
      //   if (recordingType === "song") {
      //     console.log("Title & Phrase:", songTitle, phrase);
      //     return (
      //       data.title === songTitle &&
      //       data.title !== "" &&
      //       data.phrase === phrase &&
      //       data.phrase !== ""
      //     );
      //   } else if (recordingType === "vowel") {
      //     return data.vowel === vowel && data.pitch === pitch;
      //   }
      // });

      // // update the state of array of objects processedData with filtered values array of objects
      // setProcessedData(filtered);
      // console.log("filtered", filtered);
      // setMostRecent(filtered[0]);
      // setInitial(filtered[analysisData.length - 1]);

      setProcessedData(sorted);
      setMostRecent(sorted[0]);
      setInitial(sorted[sorted.length - 1]);

      console.log("mostRecent", mostRecent);
      console.log("initial", initial);
      console.log("Processed:", processedData);
    }
  }, [analysisData, recordingType, songTitle, phrase, vowel, pitch]);

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
          {/* <Text size="xl">履歴</Text> */}
          {/* <Accordion multiple>
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
          <Text size="xl">比較</Text>
          <Group position="center">
            <Text size="lg">
              {recordingType === "song" ? songTitle : vowel}
            </Text>
          </Group>
          <Group position="center">
            <Text size="lg">{recordingType === "song" ? phrase : pitch}</Text>
          </Group>
        </Grid.Col>

        {mostRecent && initial ? (
          <Grid>
            <Grid.Col span={12}>
              <Text size="xl">NOW</Text>
              <Text size="xl">{formatDate(mostRecent.createdAt)}</Text>
              <Group position="center"></Group>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text size="xl">最初</Text>
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
            <Grid.Col span={12}>
              <Text size="xl">音程の安定 Jitter</Text>
              <Group position="center">
                {progressDisplay("jitter", initial.jitter, mostRecent.jitter)}
              </Group>
              <Group position="center">NOW {mostRecent.jitter}</Group>
              <Group position="center">最初 {initial.jitter}</Group>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text size="xl">音量の安定 Shimmer</Text>
              <Group position="center">
                {progressDisplay(
                  "shimmer",
                  initial.shimmer,
                  mostRecent.shimmer
                )}
              </Group>
              <Group position="center">NOW {mostRecent.shimmer}</Group>
              <Group position="center">最初 {initial.shimmer}</Group>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text size="xl">倍音 HNR</Text>
              <Group position="center">
                {progressDisplay("hnr", initial.hnr, mostRecent.hnr)}
              </Group>
              <Group position="center">NOW {mostRecent.hnr}</Group>
              <Group position="center">最初 {initial.hnr}</Group>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text size="xl">スペクトログラム</Text>
              <Text size="lg">音程</Text>
              <Text size="lg">Now</Text>
              <Group position="center">
                {" "}
                <Image src={mostRecent.pitchPlot} />
              </Group>
              <Text size="lg">Before</Text>
              <Group position="center">
                <Image src={initial.pitchPlot} />
              </Group>
              <Text size="lg">強度</Text>
              <Text size="lg">Now</Text>
              <Group position="center">
                <Image src={mostRecent.intensityPlot} />
              </Group>
              <Text size="lg">Before</Text>
              <Group position="center">
                <Image src={initial.intensityPlot} />
              </Group>
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
