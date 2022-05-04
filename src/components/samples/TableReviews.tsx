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

  const rows = data.map((row) => {
    return (
      <tr key={row.createdAt}>
        <td>{row.createdAt}</td>
        <td>
          <Anchor<"a"> size="sm" onClick={(event) => event.preventDefault()}>
            {row.displayName}
          </Anchor>
        </td>
        <td>{row.jitter}</td>
        <td>{row.shimmer}</td>
        <td>{row.hnr}</td>
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
