import React, { useEffect } from "react";
import {
  createStyles,
  Table,
  Progress,
  Anchor,
  Text,
  Group,
  ScrollArea,
} from "@mantine/core";
import {
  collection,
  addDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useAppSelector } from "../../redux/hooks";
import { selectUid } from "../../redux/auth/auth.slice";

const useStyles = createStyles((theme) => ({
  progressBar: {
    "&:not(:first-of-type)": {
      borderLeft: `3px solid ${
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
      }`,
    },
  },
}));

interface TableReviewsProps {
  data: {
    datetime: string;
    name: string;
    jitter: number;
    shimmer: number;
    hnr: number;
    reviews: { positive: number; negative: number };
  }[];
}

export function TableReviews({ data }: TableReviewsProps) {
  const { classes, theme } = useStyles();

  const uid = useAppSelector(selectUid);
  const analysisQuery = query(
    collection(db, "analysis"),
    where("uid", "==", uid)
    // orderBy("createdAt", "desc")
  );
  useEffect(() => {
    const unsubscribe = onSnapshot(analysisQuery, (querySnapshot) => {
      var _analysis = [];
      querySnapshot.forEach((doc) => {
        const analysisObject = {
          createdAt: doc.data().createdAt,
          audioURL: doc.data().audioURL,
          uid: doc.data().uid,
          displayName: doc.data().displayName,
          jitter: doc.data().jitter_local,
          shimmer: doc.data().shimmer_local,
          hnr: doc.data().HNR,
        };

        _analysis = [..._analysis, analysisObject];
      });
      // analysisList = _analysis;
      console.log("_analysis", _analysis);
    });

    return () => {
      unsubscribe;
    };
  }, []);

  const rows = data.map((row) => {
    return (
      <tr key={row.datetime}>
        <td>{row.datetime}</td>
        <td>
          <Anchor<"a"> size="sm" onClick={(event) => event.preventDefault()}>
            {row.name}
          </Anchor>
        </td>
        <td>{row.jitter}</td>
        <td>{row.shimmer}</td>
        <td>{row.hnr}</td>
        {/* <td>
          <Group position="apart">
            <Text size="xs" color="teal" weight={700}>
              {positiveReviews.toFixed(0)}%
            </Text>
            <Text size="xs" color="red" weight={700}>
              {negativeReviews.toFixed(0)}%
            </Text>
          </Group>
          <Progress
            classNames={{ bar: classes.progressBar }}
            sections={[
              {
                value: positiveReviews,
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.teal[9]
                    : theme.colors.teal[6],
              },
              {
                value: negativeReviews,
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.red[9]
                    : theme.colors.red[6],
              },
            ]}
          />
        </td> */}
      </tr>
    );
  });

  return (
    <ScrollArea>
      <Table
        style={{ marginBottom: "5rem", marginTop: "4rem" }}
        sx={{ minWidth: 800 }}
        verticalSpacing="xs"
      >
        <thead>
          <tr>
            <th>Time</th>
            <th>Name</th>
            <th>Jitter</th>
            <th>Shimmer</th>
            <th>HNR</th>
            {/* <th>Progress</th> */}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
