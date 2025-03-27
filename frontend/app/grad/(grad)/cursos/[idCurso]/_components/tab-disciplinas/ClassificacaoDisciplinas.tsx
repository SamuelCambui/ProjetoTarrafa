import { LoadingCard } from "@/app/grad/_components/LoadingCard";
import { GraficoProps } from "@/app/grad/_components/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { G6, Dendrogram } from "@ant-design/graphs";
import { Frown } from "lucide-react";

const { treeToGraphData } = G6;

export const ClassificacaoDisciplinas = ({ data, isLoading }: GraficoProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classificação de Disciplinas</CardTitle>
        <CardDescription>
          A classificação das disciplinas foi realizada utilizando o algoritmo
          K-Means, que agrupa as disciplinas em três clusters com base nos
          indicadores <b>primeiro</b>, <b>segundo</b> e <b>terceiro quartis</b>,{" "}
          <b>taxa de aprovação</b> e <b>média</b> das notas. Os dados foram
          normalizados antes da aplicação do algoritmo, e a dificuldade dos
          clusters foi determinada pela média dos seus indicadores, onde o grupo
          com menores valores foi classificado como <b>Difícil</b>, o
          intermediário como <b>Médio</b> e o de maiores valores como{" "}
          <b>Fácil</b>.
        </CardDescription>
      </CardHeader>
      <CardContent
        className={cn(
          Object.keys(data).length === 0 || (data as any).depth === 0
            ? "h-48"
            : "h-[800px]"
        )}
      >
        {Object.keys(data).length === 0 || (data as any).depth === 0 ? (
          <div className="flex justify-center text-lg items-center gap-2 text-muted-foreground h-48">
            <Frown className="mr-2 size-6" /> <span>Sem dados.</span>
          </div>
        ) : (
          <Dendrogram
            autoFit="view"
            layout={
              {
                direction: "LR",
                rankSep: 600,
                radial: true,
              } as any
            }
            node={{
              style: {
                fill(data) {
                  if (data.id === "Difícil" || data.parentId === "Difícil") {
                    return "red";
                  }
                  if (data.id === "Médio" || data.parentId === "Médio") {
                    return "#EADA00";
                  }
                  if (data.id === "Fácil" || data.parentId === "Fácil") {
                    return "#04BE00";
                  }
                  return "#1783FF";
                },
              },
            }}
            data={treeToGraphData(data as any)}
          />
        )}
      </CardContent>
    </Card>
  );
};
