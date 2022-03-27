import React from "react";
import { Button, ButtonProps, Group } from "@mantine/core";
import { GoogleIcon } from "./GoogleIcon";

export function GoogleButton(props: ButtonProps<"button">) {
  return (
    <Button
      leftIcon={<GoogleIcon />}
      variant="default"
      color="gray"
      {...props}
    />
  );
}

export function SocialButtons() {
  return (
    <Group position="center" sx={{ padding: 15 }}>
      <GoogleButton>Continue with Google</GoogleButton>
    </Group>
  );
}
