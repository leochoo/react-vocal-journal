import {
  Header,
  MediaQuery,
  Burger,
  Group,
  ThemeIcon,
  Text,
  NavbarProps,
  HeaderProps,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";

interface CUstomHeaderProps extends HeaderProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CustomHeader = (props: Omit<CUstomHeaderProps, "children">) => {
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
