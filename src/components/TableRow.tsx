import { useState } from "react";
import { Button, Collapse, Container, Grid, Image } from "@mantine/core";

const TableRow = ({ row, dateStr }) => {
  const [opened, setOpen] = useState(false);

  return (
    <>
      <tr key={row.createdAt}>
        <td>
          {row.pitchPlot && (
            <Button onClick={() => setOpen((o) => !o)}>見る</Button>
          )}
        </td>
        <td>{dateStr}</td>
        <td>{row.vowel}</td>
        <td>{row.pitch}</td>
        <td>{row.jitter}</td>
        <td>{row.shimmer}</td>
        <td>{row.hnr}</td>
        <td>{row.condition}</td>
        <td>
          <audio controls>
            <source src={row.audioURL} />
          </audio>
        </td>
      </tr>
      {opened && (
        <tr>
          <td colSpan={12}>
            <Container>
              <Grid>
                <Grid.Col xs={12} sm={4} md={4} lg={6}>
                  <Image src={row.pitchPlot} />
                </Grid.Col>
                <Grid.Col xs={12} sm={4} md={4} lg={6}>
                  <Image src={row.intensityPlot} />
                </Grid.Col>
              </Grid>
            </Container>
          </td>
        </tr>
      )}
    </>
  );
};

export default TableRow;
