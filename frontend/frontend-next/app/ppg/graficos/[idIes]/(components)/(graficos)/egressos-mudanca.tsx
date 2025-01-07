import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

const chartConfig = {
  "Mudou de emprego": {
    label: "Mudou de emprego",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function EgressoComMudanca({ informacoesEgressos }) {
  const egressosTotais = informacoesEgressos["dados"].length;

  const egressosComMudanca = informacoesEgressos["dados"].filter(
    (egresso) => egresso.mudanca == "Com mudança"
  ).length;

  const porcentagemMudanca =
    egressosTotais > 0 ? (egressosComMudanca / egressosTotais) * 100 : 0;

  const chartData = [
    { category: "Mudou de emprego", value: porcentagemMudanca, fill: "var(--color-success)" },
  ];

  return (
    <Card className="w-fit mx-auto">
      <CardTitle className="p-6 text-center">Egressos com mudança de emprego</CardTitle>
      <CardContent className="">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[150px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={(chartData[0].value) / 100 * 360}
            innerRadius={60} 
            outerRadius={80}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[66, 54]}
            />
            <RadialBar dataKey="value" background cornerRadius={6} /> /*
            Slightly smaller bars */
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
                          {porcentagemMudanca.toFixed(0)}%
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
      <CardFooter className="text-center">
        {egressosComMudanca} de {egressosTotais} egressos mudaram de emprego
      </CardFooter>
    </Card>
  );
}
