"use client";
import { useParams } from "next/navigation";
import { DualAxes, Line } from "@ant-design/plots";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DemoLine = () => {
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];
  const config = {
    data,
    xField: 'year',
    yField: 'value',
    point: {
      shapeField: 'square',
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
  };
  return <Line {...config} />;
};

const DemoDualAxes = () => {
  const config = {
    xField: "time",
    data: [
      { time: "10:10", call: 4, waiting: 2, people: 2 },
      { time: "10:15", call: 2, waiting: 6, people: 3 },
      { time: "10:20", call: 13, waiting: 2, people: 5 },
      { time: "10:25", call: 9, waiting: 9, people: 1 },
      { time: "10:30", call: 5, waiting: 2, people: 3 },
      { time: "10:35", call: 8, waiting: 2, people: 1 },
      { time: "10:40", call: 13, waiting: 1, people: 2 },
    ],
    legend: {
      color: {
        itemMarker: (v: any) => {
          if (v === "waiting") return "rect";
          return "smooth";
        },
      },
    },
    children: [
      {
        type: "interval",
        yField: "waiting",
      },
      {
        type: "line",
        yField: "people",
        shapeField: "smooth",
        scale: { color: { relations: [["people", "#fdae6b"]] } },
        axis: { y: { position: "right" } },
        style: { lineWidth: 2 },
      },
    ],
  };
  return <DualAxes {...config} />;
};

export const Home = () => {
  const { idIes } = useParams();

  return (
    <div className="grid grid-cols-2 gap-2">
      <Card>
        <CardHeader>
          <CardTitle>Sample</CardTitle>
          <CardDescription>This is a sample chart from Ant Design Charts.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <DemoDualAxes />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sample</CardTitle>
          <CardDescription>This is a sample chart from Ant Design Charts.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <DemoLine />
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
