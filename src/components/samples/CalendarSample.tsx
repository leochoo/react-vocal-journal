import React from "react";
import { useState } from "react";
import { RangeCalendar } from "@mantine/dates";

const CalendarSample = () => {
  const [value, setValue] = useState<[Date, Date]>([
    new Date(2021, 11, 1),
    new Date(2021, 11, 5),
  ]);

  return <RangeCalendar value={value} onChange={setValue} />;
};

export default CalendarSample;
