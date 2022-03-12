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
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import VocalJournalDarkLogo from "../assets/logo-light.png";

interface CUstomHeaderProps extends HeaderProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

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
export const CustomHeader = (props: Omit<CUstomHeaderProps, "children">) => {
  const { classes, cx } = useStyles();

  const theme = useMantineTheme();

  return (
    <Header {...props}>
      {/* Handle other responsive styles with MediaQuery component or createStyles function */}
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={props.opened}
            onClick={() => props.setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <Group className={classes.header} position="apart">
          <Image width={150} src={VocalJournalDarkLogo} alt="Vocal Journal" />
          <Code sx={{ fontWeight: 700 }}>v0.1.0</Code>
        </Group>
      </div>
    </Header>
  );
};
