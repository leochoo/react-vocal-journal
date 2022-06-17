import { useState } from "react";
import { Button, Collapse } from "@mantine/core";

const TableRow = ({ row, dateStr }) => {
  const [opened, setOpen] = useState(false);

  return (
    <>
      <tr key={row.createdAt}>
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
        <td>
          <Button onClick={() => setOpen((o) => !o)}>グラフ</Button>
        </td>
      </tr>

      <Collapse in={opened}>My Content</Collapse>
    </>
  );
};

export default TableRow;
