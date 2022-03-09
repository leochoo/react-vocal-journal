import { useState } from "react";
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
import Sample from "./Sample";
import { Redirect, Route, Switch } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import NewRecordingPage from "./pages/NewRecordingPage";
import WrapperPage from "./pages/WrapperPage";

function App() {
  return (
    <WrapperPage>
      <Switch>
        <Route exact path="/" component={Sample} />
        <Route exact path="/dashboard" component={DashboardPage} />
        <Route exact path="/new-recording" component={NewRecordingPage} />
        <Route exact path="/calendar" component={CalendarPage} />
      </Switch>
    </WrapperPage>
  );
}

export default App;
