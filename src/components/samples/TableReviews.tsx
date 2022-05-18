import React, { useEffect, useState } from "react";
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
import { useCollectionData } from "react-firebase-hooks/firestore";

const useStyles = createStyles((theme) => ({
  progressBar: {
    "&:not(:first-of-type)": {
      borderLeft: `3px solid ${
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white
      }`,
    },
  },
}));

interface AnalysisDataProps {
  data: {
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
  }[];
}

export function TableReviews({ data }: AnalysisDataProps) {
  const { classes, theme } = useStyles();

  // console.log("uid", uid);
  let user = auth.currentUser;
  // console.log("user", user);

  // sort data by field "createdAt" descending
  data.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });
  // console.log("data", data);

  const rows = data.map((row) => {
    const date = new Date(row.createdAt);
    const dateStr = date.toLocaleString("ja-JP");
    return (
      <tr key={row.createdAt}>
        <td>{dateStr}</td>
        <td>{row.vowel}</td>
        <td>{row.pitch}</td>
        <td>{row.jitter}</td>
        <td>{row.shimmer}</td>
        <td>{row.hnr}</td>
        <td>{row.condition}</td>
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
            <th>Vowel</th>
            <th>Pitch</th>
            <th>Jitter</th>
            <th>Shimmer</th>
            <th>HNR</th>
            <th>Condition</th>
            {/* <th>Progress</th> */}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
