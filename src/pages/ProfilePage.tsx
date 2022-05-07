import React, { useEffect } from "react";
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
import { selectIsLoggedIn } from "../redux/auth/auth.slice";
import { useAppSelector } from "../redux/hooks";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

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

  const [user, loading, error] = useAuthState(auth);

  async function updateProfile(user, values) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      await updateDoc(userRef, {
        // displayName: user.displayName,
        // email: user.email,
        age: values.age,
        gender: values.gender,
        experience: values.experience,
        updatedAt: new Date(),
      });
      console.log("Updated user info");
    } else {
      await setDoc(userRef, {
        createdAt: new Date(),
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        age: values.age,
        gender: values.gender,
        experience: values.experience,
        updatedAt: new Date(),
      });
      console.log("New User to firestore");
    }
  }

  async function addSubCollection(user) {
    const innerAnalysisRef = collection(db, "users", user.uid, "analysis");
    await setDoc(doc(innerAnalysisRef), {
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    updateProfile(user, values);
  };
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      age: "",
      gender: "",
      experience: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  async function fillForm(user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    // set initial values
    if (docSnap.exists()) {
      form.setValues({
        name: docSnap.data().displayName,
        email: docSnap.data().email,
        age: docSnap.data().age,
        gender: docSnap.data().gender,
        experience: docSnap.data().experience,
      });
    }
  }

  useEffect(() => {
    fillForm(user);
  }, [user]);

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
            <NumberInput label="Age" required {...form.getInputProps("age")} />

            <RadioGroup
              label="Gender"
              required
              style={{ marginTop: 10 }}
              classNames={{
                label: classes.inputLabel,
              }}
              {...form.getInputProps("gender")}
            >
              <Radio value="male" label="Male" />
              <Radio value="female" label="Female" />
            </RadioGroup>

            <NumberInput
              style={{ marginTop: 10 }}
              label="Experience (Years)"
              required
              {...form.getInputProps("experience")}
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
