import React from "react";
import { useForm, useToggle, upperFirst } from "@mantine/hooks";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Image,
  Container,
  Title,
  Center,
  createStyles,
} from "@mantine/core";
// import { GoogleLoginButton } from "react-social-login-buttons";
// import GoogleLogin from "../assets/btn_google_signin_light_normal_web.png";
// import { GoogleIcon } from "../components/GoogleIcon";
import { GoogleButton } from "../components/SocialButtons";
import vocalJournalLogo from "../assets/logo-only.png";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

const useStyles = createStyles((theme, _params, getRef) => {
  return {
    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
      },
    },
  };
});

export default function LoginPage(props: PaperProps<"div">) {
  const { classes, cx } = useStyles();
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const [type, toggle] = useToggle("login", ["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validationRules: {
      email: (val) => /^\S+@\S+$/.test(val),
      password: (val) => val.length >= 6,
    },
  });

  let location = useLocation();
  let navigate = useNavigate();

  const login = () => {
    signInWithGoogle().then((user) => {
      navigate("/dashboard", { replace: true });
    });
  };

  return (
    <Container>
      {/* <Link to="/" className={classes.li"nk}> */}
      <Link to="/" style={{ textDecoration: "none", color: "black" }}>
        <Center>
          <Image src={vocalJournalLogo} width={200} />
        </Center>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Vocal Journal
        </Title>
      </Link>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Center>
          <GoogleButton radius="xl" onClick={login}>
            Continue with Google
          </GoogleButton>
        </Center>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <form onSubmit={form.onSubmit(() => {})}>
          <Group direction="column" grow>
            {type === "register" && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
            />

            {type === "register" && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) =>
                  form.setFieldValue("terms", event.currentTarget.checked)
                }
              />
            )}
          </Group>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="gray"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit">{upperFirst(type)}</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
