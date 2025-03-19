"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocentePorCategoria } from "@/lib/ppg/definitions";
import { Line } from "@ant-design/plots";

export const DocentesCategoria = ({
  docenteCategoria,
}: {
  docenteCategoria: DocentePorCategoria[]; 
}) => {

  const config = {
    data: docenteCategoria,
    xField: "ano",
    yField: "count",
    colorField: "categoria",
    children: [
      {
        type: "line",
        yField: "count",
        // shapeField: 'smooth',
      },
    ],
    // scale: { color: { range: ["#30BF78", "#F4664A", "#FAAD14"] } },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle> Docente por Categoria </CardTitle>
      </CardHeader>
      <CardContent>
        <Line {...config} />
      </CardContent>
    </Card>
  );
};
