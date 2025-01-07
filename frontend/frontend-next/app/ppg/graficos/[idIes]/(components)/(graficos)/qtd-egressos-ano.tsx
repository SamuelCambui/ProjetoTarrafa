"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "@ant-design/plots";

interface EgressosTituladosPorAno {
  ano_egresso: number;
  quantidade: number;
}

interface EgressosTituladosPorAnoProps {
  egressosTituladosPorAno: Record<string, EgressosTituladosPorAno[]> | null;
}

export const EgressosTituladosPorAno = ({
  egressosTituladosPorAno,
}: EgressosTituladosPorAnoProps) => {
  if (!egressosTituladosPorAno || Object.keys(egressosTituladosPorAno).length === 0) {
    return <p>No data available for egressos titulados por ano.</p>;
  }

  const mergedData = Object.entries(egressosTituladosPorAno).flatMap(
    ([category, data]) =>
      data.map((item) => ({
        ...item,
        category,
      }))
  );

  const config = {
    data: mergedData,
    xField: "ano_egresso", // X-axis represents the year
    yField: "quantidade", // Y-axis represents the quantity
    seriesField: "category", // Different lines for each category
    point: {
      shape: "circle", // Point shape
      size: 4, // Point size
    },
    smooth: true, // Smooth the lines for better visualization
    tooltip: {
      showMarkers: false, // Disable tooltip markers
    },
    legend: {
      position: "top", // Position of the legend
    },
    style: {
      lineWidth: 2, // Thickness of the lines
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Egressos titulados por ano</CardTitle>
      </CardHeader>
      <CardContent>
        <Line {...config} />
      </CardContent>
    </Card>
  );
};
