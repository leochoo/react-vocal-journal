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
import { useForm } from "@mantine/form";

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
  const handleSubmit = (values: typeof form.values) => console.log(values);
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      age: 30,
      gender: "",
      experience: 1,
      note: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  return (
    <div className={classes.wrapper}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
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
            <Avatar radius="xl" size={200} />
          </div>
          <div className={classes.form}>
            <TextInput
              label="Name"
              placeholder="John Doe"
              mt="md"
              classNames={{ input: classes.input, label: classes.inputLabel }}
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              classNames={{ input: classes.input, label: classes.inputLabel }}
              {...form.getInputProps("email")}
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

            <NumberInput
              defaultValue={1}
              style={{ marginTop: 10 }}
              label="Experience (Years)"
              required
            />

            <Group position="right" mt="md">
              <Button type="submit" className={classes.control}>
                Update
              </Button>
            </Group>
          </div>
        </SimpleGrid>
      </form>
    </div>
  );
}
