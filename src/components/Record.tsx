import React from "react";
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  createStyles,
  Center,
  Button,
} from "@mantine/core";
import { GasStation, Gauge, ManualGearbox, Users } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  imageSection: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  label: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: -0.25,
    textTransform: "uppercase",
  },

  section: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  icon: {
    marginRight: 5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },
}));

const mockdata = [
  { label: "4 passengers", icon: Users },
  { label: "100 km/h in 4 seconds", icon: Gauge },
  { label: "Automatic gearbox", icon: ManualGearbox },
  { label: "Electric", icon: GasStation },
];

export function Record() {
  const { classes } = useStyles();

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>Record Audio</Card.Section>
      <Group position="apart" mt="md">
        Record vowel /a/ vowel for 2 seconds. Maintain the same pitch until the
        end.
      </Group>

      <Card.Section className={classes.section} mt="md">
        "something here"
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group spacing={30}>
          <Button radius="xl" style={{ flex: 1 }}>
            Start Recording
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
