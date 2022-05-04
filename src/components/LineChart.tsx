import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import faker from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisData {
  data: {
    audioURL: string;
    createdAt: number;
    displayName: string;
    hnr: number;
    jitter: number;
    shimmer: number;
    uid: string;
  }[];
}
interface Props {
  titleText: string;
  data: {
    x: number;
    y: number;
  }[];
}

export function LineChart({ titleText, data }: Props) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: titleText,
      },
    },
  };
  // sort by descending order
  data.sort((a, b) => {
    return b.x - a.x;
  });
  console.log("data", data);

  // convert all x in the data into one list
  const xList = data.map((item) => item.x);
  // convert all y in the data into one list
  const yList = data.map((item) => item.y);

  const chart_data = {
    labels: xList,
    datasets: [
      {
        label: titleText,
        data: yList,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Line options={options} data={chart_data} />;
}
