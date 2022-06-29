import React, { useEffect } from "react";
import { useState, ReactChild, ReactFragment, ReactPortal } from "react";
import {
  AppShell,
  Burger,
  createStyles,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
  Image,
  Code,
} from "@mantine/core";
import {
  CalendarIcon,
  DashboardIcon,
  RadiobuttonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import {
  BellRinging,
  Fingerprint,
  Key,
  Settings,
  TwoFA,
  DatabaseImport,
  Receipt2,
  SwitchHorizontal,
  Logout,
} from "tabler-icons-react";
import { useLocation, Link } from "react-router-dom";
import { CustomHeader } from "../components/CustomHeader";
import { CustomNavBar } from "../components/CustomNavBar";
import VocalJournalDarkLogo from "../assets/logo-light.png";
import { useAppSelector } from "../redux/hooks";
import { selectUid } from "../redux/auth/auth.slice";
import {
  collection,
  DocumentData,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";

interface Props {
  children: boolean | ReactChild | ReactFragment | ReactPortal;
}

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },
    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
            : theme.colors.orange[0],
        color:
          theme.colorScheme === "dark" ? theme.white : theme.colors.orange[7],
        [`& .${icon}`]: {
          color: theme.colors.orange[theme.colorScheme === "dark" ? 5 : 7],
        },
      },
    },
  };
});

const data = [
  { link: "/dashboard", label: "Dahsboard", icon: BellRinging },
  { link: "/new-recording", label: "New Recording", icon: Receipt2 },
  { link: "/calendar", label: "Calendar", icon: Fingerprint },
  { link: "", label: "SSH Keys", icon: Key },
  { link: "", label: "Databases", icon: DatabaseImport },
  { link: "", label: "Authentication", icon: TwoFA },
  { link: "", label: "Other Settings", icon: Settings },
];

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

const dataConverter = {
  toFirestore(data: AnalysisDataProps): DocumentData {
    return {
      audioURL: data.audioURL,
      createdAt: data.createdAt,
      displayName: data.displayName,
      title: data.title,
      phrase: data.phrase,
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
      title: data.title,
      phrase: data.phrase,
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

export const DataContext = React.createContext<AnalysisDataProps[]>([]);

const WrapperPage = ({ children }: Props): JSX.Element => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("");

  let uid = useAppSelector(selectUid);
  const analysisQuery = query(
    collection(db, "users", uid, "analysis").withConverter(dataConverter)
    // limit(25)
    // orderBy("createdAt")
  );
  const [analysisData] = useCollectionData(analysisQuery);

  return (
    <DataContext.Provider value={analysisData}>
      <AppShell
        // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
        navbarOffsetBreakpoint="sm"
        // fixed prop on AppShell will be automatically added to Header and Navbar
        fixed
        navbar={<CustomNavBar opened={opened} setOpened={setOpened} />}
        // navbar={
        //   <Navbar
        //     p="md"
        //     // Breakpoint at which navbar will be hidden if hidden prop is true
        //     hiddenBreakpoint="sm"
        //     // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
        //     hidden={!opened}
        //     // when viewport size is less than theme.breakpoints.sm navbar width is 100%
        //     // viewport size > theme.breakpoints.sm – width is 300px
        //     // viewport size > theme.breakpoints.lg – width is 400px
        //     width={{ sm: 300, lg: 400 }}
        //   >
        //     <Text>Application navbar</Text>
        //   </Navbar>
        // }
        header={
          // <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <CustomHeader opened={opened} setOpened={setOpened} />
          // </MediaQuery>
        }
      >
        {children}
      </AppShell>
    </DataContext.Provider>
  );
};

export default WrapperPage;
