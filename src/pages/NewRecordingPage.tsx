import React from "react";
import {
  createStyles,
  Container,
  Grid,
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
  Slider,
  InputWrapper,
} from "@mantine/core";
import { DropzoneButton } from "../components/Dropzone";

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
const NewRecordingPage = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <div>
        <Title className={classes.title}>New Recording</Title>
        <Text className={classes.description} mt="sm" mb={30}>
          Create or upload a new recording.
        </Text>
      </div>
      <Grid grow>
        <Grid.Col md={12} lg={6}>
          <div className={classes.form}>
            <RadioGroup
              label="Vowel"
              required
              style={{ marginTop: 10 }}
              classNames={{
                label: classes.inputLabel,
              }}
            >
              <Radio value="a" label="a" />
              {/* <Radio value="e" label="e" /> */}
              <Radio value="i" label="i" />
              {/* <Radio value="o" label="o" /> */}
              <Radio value="u" label="u" />
            </RadioGroup>

            <RadioGroup
              label="Pitch"
              required
              style={{ marginTop: 10 }}
              classNames={{ label: classes.inputLabel }}
            >
              <Radio value="low" label="low" />
              <Radio value="medium" label="medium" />
              <Radio value="high" label="high" />
            </RadioGroup>

            <InputWrapper
              label="Condition"
              classNames={{ label: classes.inputLabel }}
              style={{ marginBottom: 30 }}
            >
              <Slider
                color="red"
                label="mood"
                step={25}
                marks={[
                  { value: 0, label: "Bad" },
                  { value: 25, label: "So-so" },
                  { value: 50, label: "Okay" },
                  { value: 75, label: "Good" },
                  { value: 100, label: "Great" },
                ]}
              />
            </InputWrapper>

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
        </Grid.Col>
        <Grid.Col md={12} lg={6}>
          <DropzoneButton />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default NewRecordingPage;
