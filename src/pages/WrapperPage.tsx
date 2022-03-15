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

interface Props {
  children: boolean | ReactChild | ReactFragment | ReactPortal;
}

// const useStyles = createStyles((theme) => ({
//   header: {
//     paddingBottom: theme.spacing.md,
//     marginBottom: theme.spacing.md * 1.5,
//     borderBottom: `1px solid ${
//       theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
//     }`,
//   },
//   button: {
//     display: "block",
//     width: "100%",
//     padding: theme.spacing.xs,
//     borderRadius: theme.radius.sm,
//     color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

//     "&:hover": {
//       backgroundColor:
//         theme.colorScheme === "dark"
//           ? theme.colors.dark[6]
//           : theme.colors.gray[0],
//     },
//   },
//   button_active: {
//     display: "block",
//     width: "100%",
//     padding: theme.spacing.xs,
//     borderRadius: theme.radius.sm,
//     color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
//     // color: theme.colors.orange[6],
//     backgroundColor: theme.colors.orange[0],
//   },

//   link: {
//     textDecoration: "none",
//     color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
//   },

// }));

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

const WrapperPage = ({ children }: Props): JSX.Element => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("");

  const location = useLocation();

  useEffect(() => {
    // console.log(location.pathname);
  }, []);

  const links = data.map((item) => (
    <Link
      to={item.link}
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        // event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      // fixed prop on AppShell will be automatically added to Header and Navbar
      fixed
      header={
        // <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <CustomHeader opened={opened} setOpened={setOpened} />
        // </MediaQuery>
      }
      navbar={<CustomNavBar opened={opened} />}
    >
      {children}
    </AppShell>
  );
};

export default WrapperPage;
