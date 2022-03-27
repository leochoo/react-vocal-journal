import {
  Header,
  MediaQuery,
  Burger,
  Group,
  ThemeIcon,
  Text,
  NavbarProps,
  HeaderProps,
  createStyles,
  Navbar,
  Code,
  Image,
  Anchor,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { Link } from "react-router-dom";

import VocalJournalDarkLogo from "../assets/logo-light.png";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      // paddingBottom: theme.spacing.md,
      // marginBottom: theme.spacing.md,
      // borderBottom: `1px solid ${
      //   theme.colorScheme === "dark"
      //     ? theme.colors.dark[4]
      //     : theme.colors.gray[2]
      // }`,
    },
  };
});
export const CustomHeader = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { classes, cx } = useStyles();

  const theme = useMantineTheme();

  return (
    <Header height={70} p="md">
      {/* Handle other responsive styles with MediaQuery component or createStyles function */}
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Anchor component={Link} to="/dashboard">
          <Group className={classes.header} position="apart">
            <Image width={150} src={VocalJournalDarkLogo} alt="Vocal Journal" />
            <Code sx={{ fontWeight: 700 }}>v0.1.0</Code>
          </Group>
        </Anchor>
      </div>
    </Header>
  );
};
