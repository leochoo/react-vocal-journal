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
} from "@mantine/core";
import {
  CalendarIcon,
  DashboardIcon,
  RadiobuttonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { useLocation, Link } from "react-router-dom";

interface Props {
  activeMenu: string;
  children: boolean | ReactChild | ReactFragment | ReactPortal;
}

const useStyles = createStyles((theme) => ({
  button: {
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
  button_active: {
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    // color: theme.colors.orange[6],
    backgroundColor: theme.colors.orange[0],
  },

  link: {
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
  },
}));

const WrapperPage = ({ activeMenu, children }: Props): JSX.Element => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [active, setActive] = useState("");

  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  }, []);

  return (
    <AppShell
      // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
      navbarOffsetBreakpoint="sm"
      // fixed prop on AppShell will be automatically added to Header and Navbar
      fixed
      header={
        <Header height={70} padding="md">
          {/* Handle other responsive styles with MediaQuery component or createStyles function */}
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Group>
              <ThemeIcon variant="light" color="orange">
                🎙
              </ThemeIcon>
              <Text>Vocal Journal</Text>
            </Group>
          </div>
        </Header>
      }
      navbar={
        <Navbar
          padding="md"
          // Breakpoint at which navbar will be hidden if hidden prop is true
          hiddenBreakpoint="sm"
          // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
          hidden={!opened}
          // when viewport size is less than theme.breakpoints.sm navbar width is 100%
          // viewport size > theme.breakpoints.sm – width is 300px
          // viewport size > theme.breakpoints.lg – width is 400px
          width={{ sm: 300, lg: 400 }}
        >
          <UnstyledButton
            className={
              location.pathname === "/dashboard"
                ? classes.button_active
                : classes.button
            }
          >
            <Link to="/dashboard" className={classes.link}>
              <Group>
                <ThemeIcon variant="light">
                  <DashboardIcon />
                </ThemeIcon>
                <Text size="sm">Dashboard {active}</Text>
              </Group>
            </Link>
          </UnstyledButton>
          <UnstyledButton
            className={
              location.pathname === "/new-recording"
                ? classes.button_active
                : classes.button
            }
          >
            <Link to="/new-recording" className={classes.link}>
              <Group>
                <ThemeIcon variant="light" color="red">
                  <RadiobuttonIcon />
                </ThemeIcon>

                <Text size="sm">New Recording</Text>
              </Group>
            </Link>
          </UnstyledButton>
          <UnstyledButton
            className={
              location.pathname === "/calendar"
                ? classes.button_active
                : classes.button
            }
          >
            <Link to="/calendar" className={classes.link}>
              <Group>
                <ThemeIcon variant="light" color="orange">
                  <CalendarIcon />
                </ThemeIcon>

                <Text size="sm">Calendar</Text>
              </Group>
            </Link>
          </UnstyledButton>
        </Navbar>
      }
    >
      {children}
    </AppShell>
  );
};

export default WrapperPage;
