import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { LoadingCard } from "../../../../../_components/LoadingCard";
  import { GraficoReprovacoesGrade } from "./GraficoReprovacoesGrade";
  import { TabsReprovacoesProps } from "./types";
  
  export const TabsReprovacoesGrade = ({
    data,
    isLoading,
    serieFinal,
  }: TabsReprovacoesProps) => {
    if (!data || isLoading) {
      return <LoadingCard />;
    }
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Aprovação x Reprovação</CardTitle>
          <CardDescription>
            Índice de aprovação nas disciplinas por período.
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
                <GraficoReprovacoesGrade
                  data={data[`aprovacoesReprovacoesSerie${i + 1}`]}
                  isLoading={isLoading}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    );
  };
  