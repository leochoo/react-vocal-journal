import {
  Header,
  MediaQuery,
  Burger,
  Group,
  ThemeIcon,
  Text,
  NavbarProps,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";

export const CustomHeader = (
  props: Omit<NavbarProps, "children">,
  {
    opened,
    setOpened,
  }: {
    opened: boolean;
    setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  }
) => {
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

        <Group>
          <ThemeIcon variant="light" color="orange">
            🎙
          </ThemeIcon>
          <Text>Mantine AppShell with React Router</Text>
        </Group>
      </div>
    </Header>
  );
};
