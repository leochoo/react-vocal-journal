import { useState } from "react";
import { Button, Collapse, Image } from "@mantine/core";

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
      {/* This creates a warning but whatever for now. */}
      <Collapse in={opened}>
        Pitch
        <Image width="80vw" src={row.pitchPlot} />
        Intensity
        <Image width="80vw" src={row.intensityPlot} />
      </Collapse>
    </>
  );
};

export default TableRow;
