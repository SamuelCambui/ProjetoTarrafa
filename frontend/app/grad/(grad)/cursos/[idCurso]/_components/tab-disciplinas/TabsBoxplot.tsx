import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingCard } from "../../../../../_components/LoadingCard";
import { BoxplotNotasGrade } from "./BoxplotNotasGrade";
import { TabsBoxplotProps } from "./types";

export const TabsBoxplot = ({
  data,
  isLoading,
  serieFinal,
}: TabsBoxplotProps) => {
  if (!data || isLoading) {
    return <LoadingCard />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho</CardTitle>
        <CardDescription>
          Desempenho dos alunos nas disciplinas por período.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="1">
          <TabsList>
            {Array.from({ length: Number(serieFinal) }).map((_, i) => (
              <TabsTrigger value={(i + 1).toString()} key={i}>
                {i + 1}º Periodo
              </TabsTrigger>
            ))}
          </TabsList>
          {Array.from({ length: Number(serieFinal) }).map((_, i) => (
            <TabsContent value={(i + 1).toString()} key={i}>
              <BoxplotNotasGrade
                data={data[`boxplotNotasGradeSerie${i + 1}`]}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
