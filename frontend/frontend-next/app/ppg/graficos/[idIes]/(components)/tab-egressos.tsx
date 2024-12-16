"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { CurriculosDesatualizadosEgressos } from "./(graficos)/qtd-curriculos-desatualizados-egressos";
import { EgressosPorAno } from "./(graficos)/qtd-egressos-ano";

import {
  Card,
  CardContent,
  CardFooter,
  CardTitle
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartData = [
  { category: "Mudou de emprego", value: 75, fill: "var(--color-success)" }, 
];

const chartConfig = {
  visitors: {
    label: "Percentage",
  },
  "Mudou de emprego": {
    label: "Mudou de emprego",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function EgressoComMudanca() {
  return (
    <Card className="w-fit mx-auto">
      <CardTitle className="p-6">Egressos com mudança de emprego</CardTitle>
      <CardContent className="">
      <ChartContainer
  config={chartConfig}
  className="mx-auto aspect-square max-h-[150px]" 
>
  <RadialBarChart
    data={chartData}
    startAngle={0}
    endAngle={(chartData[0].value / 100) * 360}
    innerRadius={60} /* Adjusted to smaller size */
    outerRadius={80}
  >
    <PolarGrid
      gridType="circle"
      radialLines={false}
      stroke="none"
      className="first:fill-muted last:fill-background"
      polarRadius={[66, 54]} 
    />
    <RadialBar dataKey="value" background cornerRadius={6} /> /* Slightly smaller bars */
    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
      <Label
        content={({ viewBox }) => {
          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
            return (
              <text
                x={viewBox.cx}
                y={viewBox.cy}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                <tspan
                  x={viewBox.cx}
                  y={viewBox.cy}
                  className="fill-foreground text-base font-bold" 
                >
                  {chartData[0].value}%
                </tspan>
              </text>
            );
          }
          return null;
        }}
      />
    </PolarRadiusAxis>
  </RadialBarChart>
</ChartContainer>
      </CardContent>

    </Card>
  );
}

export default function TabEgressos() {
  return (
    <div>
      <h1>Egressos</h1>
      <p>Fonte: Lattes e Sucupira</p>
      <div>
        <EgressoComMudanca />
        <EgressosPorAno />
        <CurriculosDesatualizadosEgressos />
        {/* TabelaEgressos e produtos */}
      </div>
    </div>
  );
}
