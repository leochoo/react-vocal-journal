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
import { useAuthState } from "react-firebase-hooks/auth";
import { setActiveUser } from "../redux/auth/auth.slice";
import { useAppDispatch } from "../redux/hooks";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
  // const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

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

  const dispatch = useAppDispatch();

  const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      dispatch(
        setActiveUser({
          userName: result.user.displayName,
          userEmail: result.user.email,
          uid: result.user.uid,
        })
      );

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
      </Paper>
    </Container>
  );
}
