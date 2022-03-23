import React from "react";
import {
  createStyles,
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
} from "@mantine/core";
import constructionImage from "../assets/construction.jpg";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  title: {
    fontWeight: 900,
    fontSize: 34,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  control: {
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  mobileImage: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  desktopImage: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

export function UnderConstructionPage() {
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      <SimpleGrid
        spacing={80}
        cols={2}
        breakpoints={[{ maxWidth: "md", cols: 1, spacing: 40 }]}
      >
        <Image src={constructionImage} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>Under Construction 🚧</Title>
          <Text color="dimmed" size="lg">
            まだ開発中です！公開まで少々お待ちください。<br></br>
            We are still working on this feature!
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="xl"
            className={classes.control}
          >
            Go back to home page
          </Button>
        </div>
        <Image src={constructionImage} className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
  );
}
