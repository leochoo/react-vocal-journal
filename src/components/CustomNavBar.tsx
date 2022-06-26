import React, { useState } from "react";
import {
  createStyles,
  Navbar,
  Group,
  Code,
  Image,
  NavbarProps,
  Anchor,
} from "@mantine/core";
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
  PlayerRecord,
  Microphone2,
  Calendar,
  Dashboard,
} from "tabler-icons-react";
import { Link } from "react-router-dom";
import VocalJournalDarkLogo from "../assets/logo-light.png";
import { UserButton } from "./UserButton";
import { MoonIcon } from "@radix-ui/react-icons";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectUserEmail,
  selectUserName,
  setLoggedOutUser,
} from "../redux/auth/auth.slice";

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
  { link: "/dashboard", label: "Dashboard", icon: Dashboard },
  { link: "/new-recording", label: "New Recording", icon: Microphone2 },
  // { link: "/calendar", label: "Calendar", icon: Calendar },
  // { link: "", label: "SSH Keys", icon: Key },
  // { link: "", label: "Databases", icon: DatabaseImport },
  // { link: "", label: "Authentication", icon: TwoFA },
  // { link: "", label: "Other Settings", icon: Settings },
];

interface Props {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export function CustomNavBar({ opened, setOpened }: Props): JSX.Element {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Billing");

  const userName = useAppSelector(selectUserName);
  const userEmail = useAppSelector(selectUserEmail);

  const links = data.map((item) => (
    <Anchor
      component={Link}
      to={item.link}
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      key={item.label}
      onClick={(event) => {
        // event.preventDefault();
        setActive(item.label);
        setOpened(false);
      }}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </Anchor>
  ));

  const dispatch = useAppDispatch();

  const logout = () => {
    // console.log("logout clicked");
    signOut(auth).then(() => {
      dispatch(setLoggedOutUser());
    });
  };
  return (
    // <Navbar height={700} width={{ sm: 300 }} p="md">
    <Navbar
      width={{ sm: 300, lg: 300 }}
      p="md"
      // Breakpoint at which navbar will be hidden if hidden prop is true
      hiddenBreakpoint="sm"
      // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
      hidden={!opened}
      // when viewport size is less than theme.breakpoints.sm navbar width is 100%
      // viewport size > theme.breakpoints.sm – width is 300px
      // viewport size > theme.breakpoints.lg – width is 400px
      // width={{ sm: 300, lg: 400 }}
    >
      <Navbar.Section grow>{links}</Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <Link
          to="/profile"
          className={classes.link}
          onClick={() => {
            setOpened(false);
          }}
        >
          <UserButton name={userName} email={userEmail} />
        </Link>

        <Group className={classes.link} onClick={logout}>
          <Logout className={classes.linkIcon} />
          <span>Logout</span>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
}
