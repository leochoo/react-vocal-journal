import React from "react";
import {
  createStyles,
  Text,
  Title,
  SimpleGrid,
  TextInput,
  Textarea,
  Button,
  Group,
  ActionIcon,
  Avatar,
  Select,
  NumberInput,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
} from "@mantine/core";
import { BrandTwitter, BrandYoutube, BrandInstagram } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 400,
    boxSizing: "border-box",
    backgroundImage: `linear-gradient(-60deg, ${
      theme.colors[theme.primaryColor][4]
    } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl * 2.5,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: theme.spacing.xl * 1.5,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.white,
    lineHeight: 1,
  },

  description: {
    color: theme.colors[theme.primaryColor][0],
    maxWidth: 300,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  form: {
    backgroundColor: theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
  },

  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    "&::placeholder": {
      color: theme.colors.gray[5],
    },
  },
  radioGroup: {
    marginBottom: theme.spacing.md,
  },

  inputLabel: {
    color: theme.black,
  },

  control: {
    backgroundColor: theme.colors[theme.primaryColor][6],
  },
}));

export default function ProfilePage() {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <SimpleGrid
        cols={2}
        spacing={50}
        breakpoints={[{ maxWidth: "md", cols: 1 }]}
      >
        <div>
          <Title className={classes.title}>Profile Page</Title>
          <Text className={classes.description} mt="sm" mb={30}>
            Description
          </Text>
          <Avatar radius="xl" size={300} />
        </div>
        <div className={classes.form}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            classNames={{ input: classes.input, label: classes.inputLabel }}
          />

          <TextInput
            label="Name"
            placeholder="John Doe"
            mt="md"
            classNames={{ input: classes.input, label: classes.inputLabel }}
          />
          <NumberInput defaultValue={30} label="Age" required />

          <RadioGroup
            label="Gender"
            required
            style={{ marginTop: 10 }}
            classNames={{
              label: classes.inputLabel,
            }}
          >
            <Radio value="male" label="Male" />
            <Radio value="female" label="Female" />
          </RadioGroup>

          <RadioGroup
            label="Level"
            required
            style={{ marginTop: 10 }}
            classNames={{ label: classes.inputLabel }}
          >
            <Radio value="amateur" label="Amateur" />
            <Radio value="professional" label="Professional" />
          </RadioGroup>

          <NumberInput
            defaultValue={1}
            style={{ marginTop: 10 }}
            label="Experience (Years)"
            required
          />

          <RadioGroup
            label="Voice Disorder"
            required
            style={{ marginTop: 10 }}
            classNames={{ label: classes.inputLabel }}
          >
            <Radio value="0" label="No" />
            <Radio value="1" label="Yes" />
          </RadioGroup>
          <TextInput
            label="Name of voice disorder"
            placeholder="Name of the voice disorder"
            mt="md"
            classNames={{ input: classes.input, label: classes.inputLabel }}
          />

          <NumberInput
            defaultValue={2010}
            style={{ marginTop: 10 }}
            label="Year Diagnosed"
          />

          <Textarea
            label="Note"
            placeholder="Notes"
            minRows={4}
            mt="md"
            classNames={{ input: classes.input, label: classes.inputLabel }}
          />

          <Group position="right" mt="md">
            <Button className={classes.control}>Update</Button>
          </Group>
        </div>
      </SimpleGrid>
    </div>
  );
}
